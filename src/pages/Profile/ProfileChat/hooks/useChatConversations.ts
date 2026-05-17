import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllConversation } from "@api/configs/chat.config";
import { getUserPRofile } from "@api/configs/user.config";
import type { ConversationResponseDto } from "@api/dtos/chat.dto";
import { ConverationEndpoint } from "@api/endpoints/chat.endpoint";
import { UserEndpoint } from "@api/endpoints/user.endpoint";
import { useMediaQuery } from "@common/hooks/useMediaQuery";
import { chatSocket } from "@socket/domains/chat.socket";
import { toConversationView } from "../utils";

type ProfileChatLocationState = {
  conversationId?: number;
  source?: "location-detail";
};

export const useChatConversations = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 576px)");
  const locationState = location.state as ProfileChatLocationState | null;
  const hasConsumedLocationTargetRef = useRef(false);
  const [activeConversationId, setActiveConversationId] = useState<number>();

  const { data: currentUser, isLoading: isCurrentUserLoading } = useQuery({
    queryKey: [UserEndpoint.GET_USER_INFORMATION],
    queryFn: () => getUserPRofile(),
  });

  const { data: conversations, isLoading: isConversationLoading } = useQuery({
    queryKey: [ConverationEndpoint.GET_CHAT_CONVERSATION],
    queryFn: () => getAllConversation(),
  });

  const locationConversationId = useMemo(() => {
    if (locationState?.source !== "location-detail") return undefined;

    const value = Number(locationState?.conversationId);
    return Number.isFinite(value) && value > 0 ? value : undefined;
  }, [locationState?.conversationId, locationState?.source]);

  useEffect(() => {
    if (locationState?.source === "location-detail" && locationConversationId) {
      hasConsumedLocationTargetRef.current = false;
    }
  }, [locationConversationId, locationState?.source]);

  useEffect(() => {
    const unsubscribe = chatSocket.subscribeConversationUpdated((event) => {
      const nextConversation = event.data;
      if (!nextConversation) return;

      queryClient.setQueryData<ConversationResponseDto[]>(
        [ConverationEndpoint.GET_CHAT_CONVERSATION],
        (currentConversations = []) => {
          const existed = currentConversations.some(
            (conversation) =>
              conversation.conversationId === nextConversation.conversationId,
          );

          const updatedConversations = existed
            ? currentConversations.map((conversation) =>
                conversation.conversationId === nextConversation.conversationId
                  ? nextConversation
                  : conversation,
              )
            : [nextConversation, ...currentConversations];

          return [...updatedConversations].sort((left, right) => {
            const leftPinned = left.participants.some(
              (participant) =>
                participant.userId === currentUser?.id && participant.isPinned,
            );
            const rightPinned = right.participants.some(
              (participant) =>
                participant.userId === currentUser?.id && participant.isPinned,
            );

            if (leftPinned !== rightPinned) {
              return leftPinned ? -1 : 1;
            }

            return (
              new Date(right.lastMessageAt || 0).getTime() -
              new Date(left.lastMessageAt || 0).getTime()
            );
          });
        },
      );
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser?.id, queryClient]);

  useEffect(() => {
    if (!conversations?.length) return;

    const hasActiveConversation = conversations.some(
      (conversation) => conversation.conversationId === activeConversationId,
    );

    if (locationState?.source === "location-detail" && locationConversationId) {
      const targetConversation = conversations.find(
        (conversation) => conversation.conversationId === locationConversationId,
      );

      if (targetConversation) {
        if (activeConversationId !== targetConversation.conversationId) {
          setActiveConversationId(targetConversation.conversationId);
        }

        if (!hasConsumedLocationTargetRef.current) {
          hasConsumedLocationTargetRef.current = true;
          navigate(location.pathname, { replace: true });
        }
        return;
      }
    }

    if (hasActiveConversation) return;

    if (isMobile) {
      return;
    }

    const pinnedConversation = currentUser?.id
      ? conversations.find((conversation) =>
          conversation.participants.some(
            (participant) =>
              participant.userId === currentUser.id && participant.isPinned,
          ),
        )
      : undefined;

    const nextActiveConversation = pinnedConversation ?? conversations[0];
    if (nextActiveConversation) {
      setActiveConversationId(nextActiveConversation.conversationId);
    }
  }, [
    activeConversationId,
    conversations,
    currentUser?.id,
    isMobile,
    location.pathname,
    locationConversationId,
    locationState?.source,
    navigate,
  ]);

  const activeConversation = useMemo(
    () =>
      conversations?.find(
        (conversation) =>
          conversation.conversationId === activeConversationId,
      ),
    [activeConversationId, conversations],
  );

  const conversationViews = useMemo(
    () =>
      (conversations || []).map((conversation) =>
        toConversationView(conversation, currentUser?.id),
      ),
    [conversations, currentUser?.id],
  );

  return {
    activeConversation,
    activeConversationId,
    conversationViews,
    conversations: conversations || [],
    currentUser,
    currentUserId: currentUser?.id,
    isLoading: isCurrentUserLoading || isConversationLoading,
    isMobile,
    locationConversationId,
    selectConversation: setActiveConversationId,
  };
};
