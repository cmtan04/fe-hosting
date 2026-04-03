import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllConversation } from "../../../../api/configs/chat.config";
import { getUserPRofile } from "../../../../api/configs/user.config";
import type { ConversationResponseDto } from "../../../../api/dtos/chat.dto";
import { ConverationEndpoint } from "../../../../api/endpoints/chat.endpoint";
import { UserEndpoint } from "../../../../api/endpoints/user.endpoint";

import { ChatItem } from "../../../../components/Chat/ChatItem";
import { ChatPanel } from "../../../../components/Chat/ChatPanel";
import "../style.scss";

type ProfileChatLocationState = {
  conversationId?: number;
  source?: "location-detail";
};

export const ProfileChat = () => {
  const [active, setActive] = useState<number>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as ProfileChatLocationState | null;
  const hasConsumedLocationTargetRef = useRef(false);

  const { data: currentUser } = useQuery({
    queryKey: [UserEndpoint.GET_USER_INFORMATION],
    queryFn: () => getUserPRofile(),
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

  const { data: conversations } = useQuery({
    queryKey: [ConverationEndpoint.GET_CHAT_CONVERSATION],
    queryFn: () => getAllConversation(),
  });

  useEffect(() => {
    if (!conversations?.length) return;

    const hasActiveConversation = conversations.some(
      (conversation) => conversation.conversationId === active,
    );

    if (locationState?.source === "location-detail" && locationConversationId) {
      const targetConversation = conversations.find(
        (conversation) => conversation.conversationId === locationConversationId,
      );

      if (targetConversation) {
        if (active !== targetConversation.conversationId) {
          setActive(targetConversation.conversationId);
        }

        if (!hasConsumedLocationTargetRef.current) {
          hasConsumedLocationTargetRef.current = true;
          navigate(location.pathname, { replace: true });
        }
        return;
      }
    }

    if (hasActiveConversation) return;

    const pinnedConversation = currentUser?.id
      ? conversations.find((conversation) =>
          conversation.participants.some(
            (participant) =>
              participant.userId === currentUser.id && participant.isPinned,
          ),
        )
      : undefined;

    const nextActiveConversation = pinnedConversation ?? conversations[0];
    if (
      nextActiveConversation &&
      active !== nextActiveConversation.conversationId
    ) {
      setActive(nextActiveConversation.conversationId);
    }
  }, [
    active,
    conversations,
    currentUser?.id,
    location.pathname,
    locationConversationId,
    locationState?.source,
    navigate,
  ]);

  return (
    <div className="profile__chat">
      <div className="profile__chat-header">
        <h1>Đoạn chat</h1>
      </div>
      <div className="profile__chat-body">
        <div className="profile__chat-left">
          {conversations?.length === 0 && (
            <div className="profile__chat-empty">
              <p>Không có cuộc trò chuyện nào.</p>
            </div>
          )}
          {conversations?.map((conversation: ConversationResponseDto) => {
            const currentParticipant = conversation.participants.find(
              (participant) => participant.userId === currentUser?.id,
            );

            return (
              <div
                key={conversation.conversationId}
                className="profile__chat-left-item"
                onClick={() => {
                  if (active === conversation.conversationId) {
                    setActive(0);
                  } else {
                    setActive(conversation.conversationId);
                  }
                }}
              >
                
                <ChatItem
                  icon={
                    conversation.conversationAvatar || conversation.toUser?.avatarUrl
                  }
                  name={
                    currentParticipant?.nickname ||
                    conversation.conversationName ||
                    conversation.toUser?.fullName ||
                    conversation.toUser?.username
                  }
                content={conversation.lastMessagePreview || ""}
                time={conversation.lastMessageAt || undefined}
                isRead={conversation.unreadCount === 0}
                type={conversation.conversationType}
                isPinned={!!currentParticipant?.isPinned}
                focus={Number(active) === Number(conversation.conversationId)}
              />
              </div>
            );
          })}
        </div>
        <div className="profile__chat-right">
          <ChatPanel
            data={conversations?.find((item) => item.conversationId === active)}
            currentUserId={currentUser?.id}
          />
        </div>
      </div>
    </div>
  );
};
