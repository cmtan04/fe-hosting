import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getConversationMessages,
  muteConversation,
  pinConversation,
  setConversationNickname,
} from "@api/configs/chat.config";
import type {
  ConversationResponseDto,
  MessageResponseDto,
  MuteConversationPreset,
} from "@api/dtos/chat.dto";
import { ConverationEndpoint } from "@api/endpoints/chat.endpoint";
import { chatSocket } from "@socket/domains/chat.socket";
import {
  getConversationDisplayName,
  getCurrentParticipant,
  isChatMessageStatus,
  sortMessagesAsc,
  toConversationView,
} from "../utils";

interface ConversationFilter {
  id: number;
  page: number;
  limit: number;
}

export const mutePresetItems: {
  key: string;
  preset: MuteConversationPreset;
  label: string;
}[] = [
  { key: "mute-15m", preset: "15m", label: "15 phút" },
  { key: "mute-1h", preset: "1h", label: "1 giờ" },
  { key: "mute-8h", preset: "8h", label: "8 giờ" },
  { key: "mute-24h", preset: "24h", label: "24 giờ" },
  {
    key: "mute-no-end-time-yet",
    preset: "no end time yet",
    label: "Cho đến khi tôi bật lại",
  },
];

export const useChatMessages = (
  conversation?: ConversationResponseDto,
  currentUserId?: number,
) => {
  const queryClient = useQueryClient();
  const messageBodyRef = useRef<HTMLElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<ConversationFilter>({
    id: conversation?.conversationId || 0,
    page: 1,
    limit: 20,
  });
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");

  const conversationId = conversation?.conversationId;
  const participant = useMemo(
    () => getCurrentParticipant(conversation, currentUserId),
    [conversation, currentUserId],
  );
  const conversationView = useMemo(
    () => (conversation ? toConversationView(conversation, currentUserId) : undefined),
    [conversation, currentUserId],
  );
  const displayName = useMemo(
    () => getConversationDisplayName(conversation, currentUserId),
    [conversation, currentUserId],
  );

  useEffect(() => {
    if (conversationId) {
      setFilter((prev) => ({
        ...prev,
        id: conversationId,
      }));
    }
  }, [conversationId]);

  useEffect(() => {
    setNicknameInput(displayName);
    setIsNicknameEditing(false);
  }, [displayName, conversationId]);

  const invalidateConversationList = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: [ConverationEndpoint.GET_CHAT_CONVERSATION],
    });
  }, [queryClient]);

  const setNicknameMutation = useMutation({
    mutationFn: (nickname: string | null) =>
      setConversationNickname({
        conversationId: conversationId!,
        nickname,
      }),
    onSuccess: invalidateConversationList,
  });

  const pinConversationMutation = useMutation({
    mutationFn: (nextPinned: boolean) =>
      pinConversation({
        conversationId: conversationId!,
        isPinned: nextPinned,
      }),
    onSuccess: invalidateConversationList,
  });

  const muteConversationMutation = useMutation({
    mutationFn: (preset: MuteConversationPreset) =>
      muteConversation({
        conversationId: conversationId!,
        preset,
      }),
    onSuccess: invalidateConversationList,
  });

  const { data: messages, isLoading } = useQuery<MessageResponseDto[]>({
    queryKey: [ConverationEndpoint.GET_CHAT_CONVERSATION_MESSAGE, filter],
    queryFn: () =>
      getConversationMessages(filter.id, {
        page: filter.page,
        limit: filter.limit,
      }),
    enabled: !!conversationId,
  });

  const sortedMessages = useMemo(() => sortMessagesAsc(messages), [messages]);
  const latestMessage = sortedMessages[sortedMessages.length - 1];
  const lastMessageId = latestMessage?.id;
  const lastOwnMessageId = useMemo(
    () =>
      [...sortedMessages]
        .reverse()
        .find((item) => item.senderId === currentUserId)?.id,
    [currentUserId, sortedMessages],
  );

  useEffect(() => {
    if (!conversationId) return;

    void chatSocket.joinConversation(conversationId);

    return () => {
      void chatSocket.leaveConversation(conversationId);
    };
  }, [conversationId]);

  useEffect(() => {
    const unsubscribeMessage = chatSocket.subscribeMessageSent((event) => {
      if (event.data.conversationId !== conversationId) return;

      queryClient.setQueryData<MessageResponseDto[]>(
        [ConverationEndpoint.GET_CHAT_CONVERSATION_MESSAGE, filter],
        (currentMessages = []) => {
          if (currentMessages.some((item) => item.id === event.data.id)) {
            return currentMessages;
          }

          return [event.data, ...currentMessages];
        },
      );
    });

    const unsubscribeConversation = chatSocket.subscribeConversationUpdated(
      (event) => {
        queryClient.setQueryData<ConversationResponseDto[]>(
          [ConverationEndpoint.GET_CHAT_CONVERSATION],
          (currentConversations = []) =>
            currentConversations.map((item) =>
              item.conversationId === event.data.conversationId
                ? event.data
                : item,
            ),
        );
      },
    );

    const unsubscribeStatus = chatSocket.subscribeMessageStatusUpdated(
      (event) => {
        if (event.data.conversationId !== conversationId) return;

        queryClient.setQueryData<MessageResponseDto[]>(
          [ConverationEndpoint.GET_CHAT_CONVERSATION_MESSAGE, filter],
          (currentMessages = []) =>
            currentMessages.map((item) =>
              item.id === event.data.messageId
                ? {
                    ...item,
                    status: event.data.status,
                    updatedAt: event.data.updatedAt,
                  }
                : item,
            ),
        );
      },
    );

    return () => {
      unsubscribeMessage();
      unsubscribeConversation();
      unsubscribeStatus();
    };
  }, [conversationId, filter, queryClient]);

  useEffect(() => {
    if (!messageBodyRef.current) return;

    messageBodyRef.current.scrollTo({
      top: messageBodyRef.current.scrollHeight,
      behavior: "auto",
    });
  }, [conversationId]);

  useEffect(() => {
    if (!lastMessageId) return;

    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [lastMessageId]);

  useEffect(() => {
    if (!conversationId || !latestMessage) return;
    if (latestMessage.senderId === currentUserId) return;
    if (latestMessage.status === "READ") return;

    void chatSocket.markConversationAsRead({
      conversationId,
      messageId: latestMessage.id,
    });
  }, [conversationId, latestMessage, currentUserId]);

  const commitNickname = useCallback(async () => {
    const trimmedNickname = nicknameInput.trim();
    const currentNickname = participant?.nickname?.trim() || "";

    setIsNicknameEditing(false);

    if (trimmedNickname === currentNickname) {
      setNicknameInput(participant?.nickname || displayName);
      return;
    }

    await setNicknameMutation.mutateAsync(trimmedNickname || null);
  }, [displayName, nicknameInput, participant?.nickname, setNicknameMutation]);

  const togglePin = useCallback(async () => {
    await pinConversationMutation.mutateAsync(!participant?.isPinned);
  }, [participant?.isPinned, pinConversationMutation]);

  const muteByPreset = useCallback(
    async (preset: MuteConversationPreset) => {
      await muteConversationMutation.mutateAsync(preset);
    },
    [muteConversationMutation],
  );

  const messageViews = useMemo(
    () =>
      sortedMessages.map((message) => ({
        message,
        isMine: message.senderId === currentUserId,
        avatarUrl:
          message.senderAvatarUrl ||
          conversationView?.avatarUrl ||
          conversation?.conversationAvatar ||
          "",
        showStatus:
          message.senderId === currentUserId && message.id === lastOwnMessageId,
        messageStatus: isChatMessageStatus(message.status)
          ? message.status
          : undefined,
      })),
    [
      conversation?.conversationAvatar,
      conversationView?.avatarUrl,
      currentUserId,
      lastOwnMessageId,
      sortedMessages,
    ],
  );

  return {
    commitNickname,
    conversationView,
    isLoading,
    isNicknameEditing,
    lastOwnMessageId,
    messageBodyRef,
    messageEndRef,
    messageViews,
    muteByPreset,
    mutePresetItems,
    nicknameInput,
    setIsNicknameEditing,
    setNicknameInput,
    sortedMessages,
    togglePin,
  };
};
