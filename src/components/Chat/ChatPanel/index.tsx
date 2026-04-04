import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dropdown, type MenuProps } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getConversationMessages,
  muteConversation,
  pinConversation,
  setConversationNickname,
} from "../../../api/configs/chat.config";
import type {
  ConversationResponseDto,
  MessageResponseDto,
  MuteConversationPreset,
} from "../../../api/dtos/chat.dto";
import { ConverationEndpoint } from "../../../api/endpoints/chat.endpoint";
import bellOffIcn from "../../../assets/svg/profile/bellOff.svg";
import bioIcn from "../../../assets/svg/profile/bio.svg";
import deleteIcn from "../../../assets/svg/profile/delete.svg";
import hideIcn from "../../../assets/svg/profile/hide.svg";
import penIcn from "../../../assets/svg/profile/pen.svg";
import pinIcn from "../../../assets/svg/profile/pin.svg";
import unpinIcn from "../../../assets/svg/profile/unpin.svg";
import threeDotIcn from "../../../assets/svg/three-dots.svg";
import { chatSocket } from "../../../socket/domains/chat.socket";
import { ChatInput } from "../ChatInput";
import { ChatLabel } from "../ChatLabel";

export interface ChatPanelProps {
  data?: ConversationResponseDto;
  currentUserId?: number;
}

interface Conversation {
  id: number;
  page: number;
  limit: number;
}

const mutePresetItems: {
  key: string;
  preset: MuteConversationPreset;
  label: string;
}[] = [
  { key: "mute-15m", preset: "15m", label: "15 phÃºt" },
  { key: "mute-1h", preset: "1h", label: "1 giá»" },
  { key: "mute-8h", preset: "8h", label: "8 giá»" },
  { key: "mute-24h", preset: "24h", label: "24 giá»" },
  {
    key: "mute-no-end-time-yet",
    preset: "no end time yet",
    label: "Cho Ä‘áº¿n khi tÃ´i báº­t láº¡i",
  },
];

export const ChatPanel = (props: ChatPanelProps) => {
  const queryClient = useQueryClient();
  const messageBodyRef = useRef<HTMLDivElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [conversation, setConversation] = useState<Conversation>({
    id: props?.data?.conversationId || 0,
    page: 1,
    limit: 20,
  });
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");

  const currentParticipant = useMemo(
    () =>
      props.currentUserId != null
        ? props.data?.participants.find(
            (participant) => participant.userId === props.currentUserId,
          )
        : undefined,
    [props.currentUserId, props.data?.participants],
  );

  const fallbackName =
    props.data?.conversationName ||
    props.data?.toUser?.fullName ||
    props.data?.toUser?.username ||
    "Cuá»™c trÃ² chuyá»‡n";

  const displayName = currentParticipant?.nickname || fallbackName;
  const displayAvatar =
    props.data?.conversationAvatar || props.data?.toUser?.avatarUrl || "";
  const displayEmail = props.data?.toUser?.email || "";
  const isPinned = !!currentParticipant?.isPinned;

  useEffect(() => {
    if (props?.data?.conversationId) {
      setConversation((prev) => ({
        ...prev,
        id: props.data!.conversationId,
      }));
    }
  }, [props?.data?.conversationId]);

  useEffect(() => {
    setNicknameInput(displayName);
    setIsNicknameEditing(false);
  }, [displayName, props.data?.conversationId]);

  const invalidateConversationList = async () => {
    await queryClient.invalidateQueries({
      queryKey: [ConverationEndpoint.GET_CHAT_CONVERSATION],
    });
  };

  const setNicknameMutation = useMutation({
    mutationFn: (nickname: string | null) =>
      setConversationNickname({
        conversationId: props.data!.conversationId,
        nickname,
      }),
    onSuccess: invalidateConversationList,
  });

  const pinConversationMutation = useMutation({
    mutationFn: (nextPinned: boolean) =>
      pinConversation({
        conversationId: props.data!.conversationId,
        isPinned: nextPinned,
      }),
    onSuccess: invalidateConversationList,
  });

  const muteConversationMutation = useMutation({
    mutationFn: (preset: MuteConversationPreset) =>
      muteConversation({
        conversationId: props.data!.conversationId,
        preset,
      }),
    onSuccess: invalidateConversationList,
  });

  const { data: message } = useQuery<MessageResponseDto[]>({
    queryKey: [ConverationEndpoint.GET_CHAT_CONVERSATION_MESSAGE, conversation],
    queryFn: () =>
      getConversationMessages(conversation.id, {
        page: conversation.page,
        limit: conversation.limit,
      }),
    enabled: !!props.data?.conversationId,
  });

  const sortedMessages = useMemo(
    () =>
      [...(message ?? [])].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [message],
  );
  const latestMessage = sortedMessages[sortedMessages.length - 1];
  const lastMessageId = latestMessage?.id;
  const lastOwnMessageId = useMemo(
    () =>
      [...sortedMessages]
        .reverse()
        .find((item) => item.senderId === props.currentUserId)?.id,
    [props.currentUserId, sortedMessages],
  );

  useEffect(() => {
    if (!props.data?.conversationId) return;

    void chatSocket.joinConversation(props.data.conversationId);

    return () => {
      void chatSocket.leaveConversation(props.data!.conversationId);
    };
  }, [props.data?.conversationId]);

  useEffect(() => {
    const unsubscribeMessage = chatSocket.subscribeMessageSent((event) => {
      if (event.data.conversationId !== props.data?.conversationId) return;

      queryClient.setQueryData<MessageResponseDto[]>(
        [ConverationEndpoint.GET_CHAT_CONVERSATION_MESSAGE, conversation],
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
        if (event.data.conversationId !== props.data?.conversationId) return;

        queryClient.setQueryData<MessageResponseDto[]>(
          [ConverationEndpoint.GET_CHAT_CONVERSATION_MESSAGE, conversation],
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
  }, [conversation, props.data?.conversationId, queryClient]);

  useEffect(() => {
    if (!messageBodyRef.current) return;

    messageBodyRef.current.scrollTo({
      top: messageBodyRef.current.scrollHeight,
      behavior: "auto",
    });
  }, [props.data?.conversationId]);

  useEffect(() => {
    if (!lastMessageId) return;

    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [lastMessageId]);

  useEffect(() => {
    if (!props.data?.conversationId || !latestMessage) return;
    if (latestMessage.senderId === props.currentUserId) return;
    if (latestMessage.status === "READ") return;

    void chatSocket.markConversationAsRead({
      conversationId: props.data.conversationId,
      messageId: latestMessage.id,
    });
  }, [latestMessage, props.currentUserId, props.data?.conversationId]);

  const commitNickname = async () => {
    const trimmedNickname = nicknameInput.trim();
    const currentNickname = currentParticipant?.nickname?.trim() || "";

    setIsNicknameEditing(false);

    if (trimmedNickname === currentNickname) {
      setNicknameInput(currentParticipant?.nickname || fallbackName);
      return;
    }

    await setNicknameMutation.mutateAsync(trimmedNickname || null);
  };

  const handleMenuClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "nickname") {
      setIsNicknameEditing(true);
      return;
    }

    if (key === "pin") {
      await pinConversationMutation.mutateAsync(!isPinned);
      return;
    }

    const mutePreset = mutePresetItems.find((item) => item.key === key)?.preset;
    if (mutePreset) {
      await muteConversationMutation.mutateAsync(mutePreset);
    }
  };

  const chatMenuAction: MenuProps["items"] = [
    {
      key: "nickname",
      label: "Biá»‡t danh",
      icon: <img src={penIcn} alt="pen" />,
    },
    {
      key: "profile",
      label: "Xem trang cÃ¡ nhÃ¢n",
      icon: <img src={bioIcn} alt="bio" />,
    },
    {
      key: "pin",
      label: isPinned ? "Bá» ghim cuá»™c trÃ² chuyá»‡n" : "Ghim cuá»™c trÃ² chuyá»‡n",
      icon: (
        <img src={isPinned ? unpinIcn : pinIcn} alt={isPinned ? "unpin" : "pin"} />
      ),
    },
    {
      key: "mute",
      label: "Táº¯t thÃ´ng bÃ¡o",
      icon: <img src={bellOffIcn} alt="bell-off" />,
      children: mutePresetItems.map((item) => ({
        key: item.key,
        label: item.label,
      })),
    },
    {
      key: "hide",
      label: "áº¨n cuá»™c trÃ² chuyá»‡n",
      icon: <img src={hideIcn} alt="hide" />,
    },
    {
      key: "delete",
      label: "XÃ³a cuá»™c trÃ² chuyá»‡n",
      icon: <img src={deleteIcn} alt="delete" />,
    },
  ];

  return (
    <>
      {props.data && (
        <div className="chat__panel">
          <div className="chat__panel-header">
            <div className="chat__panel-header-left">
              <img src={displayAvatar} alt={displayName} />
            </div>
            <div className="chat__panel-header-right">
              <div className="row-left">
                {!isNicknameEditing ? (
                  <p className="line-1 name-label show">{displayName}</p>
                ) : (
                  <input
                    autoFocus
                    className="name-input show"
                    id="name-input"
                    name="name"
                    value={nicknameInput}
                    type="text"
                    onChange={(e) => setNicknameInput(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        await commitNickname();
                      }
                    }}
                    onBlur={commitNickname}
                  />
                )}
                <p className="line-2">{displayEmail}</p>
              </div>

              <div className="row-right">
                <Dropdown
                  menu={{
                    items: chatMenuAction,
                    onClick: handleMenuClick,
                  }}
                  trigger={["click"]}
                >
                  <img
                    src={threeDotIcn}
                    alt="three-dot"
                    onClick={(e) => e.preventDefault()}
                  />
                </Dropdown>
              </div>
            </div>
          </div>
          <div ref={messageBodyRef} className="chat__panel-body">
            {message && message.length > 0 ? (
              <>
                {sortedMessages.map((item) => (
                  <ChatLabel
                    key={item.id}
                    isYour={item.senderId === props.currentUserId}
                    timeLine={item.createdAt}
                    content={item.content || ""}
                    avartar={item.senderAvatarUrl || displayAvatar}
                    type={item.type}
                    messageStatus={
                      item.status === "SENT" ||
                      item.status === "DELIVERED" ||
                      item.status === "READ"
                        ? item.status
                        : undefined
                    }
                    showStatus={
                      item.senderId === props.currentUserId &&
                      item.id === lastOwnMessageId
                    }
                  />
                ))}
              </>
            ) : (
              <ChatLabel
                isYour={true}
                timeLine={props.data.conversationCreatedAt}
                content={props.data.lastMessagePreview || "KhÃ´ng cÃ³ tin nháº¯n nÃ o"}
                avartar={displayAvatar}
              />
            )}
            <div ref={messageEndRef} />
          </div>
          <div className="chat__panel-footer">
            <ChatInput conversationId={props.data.conversationId} />
          </div>
        </div>
      )}
    </>
  );
};
