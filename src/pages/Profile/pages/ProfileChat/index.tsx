import { useQuery } from "@tanstack/react-query";
import { getAllConversation } from "../../../../api/configs/chat.config";
import type { ConversationResponseDto } from "../../../../api/dtos/chat.dto";
import { ConverationEndpoint } from "../../../../api/endpoints/chat.endpoint";
import { ChatItem } from "../../../../components/Chat/ChatItem";
import { ChatPanel } from "../../../../components/Chat/ChatPanel";
import "../style.scss";
import { use, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const ProfileChat = () => {
  const [active, setActive] = useState<number>();
  const location = useLocation();

  useEffect(() => {
    const conversationconversationId = location?.state?.conversationId;

    if (conversationconversationId) {
      setActive(conversationconversationId);
    }
  }, [location]);

  const { data: conversations } = useQuery({
    queryKey: [ConverationEndpoint.GET_CHAT_CONVERSATION],
    queryFn: () => getAllConversation(),
  });

  useEffect(() => {
    const firstconversationId = conversations?.[0]?.conversationId;
    if (firstconversationId) {
      setActive(firstconversationId);
    }
  }, [conversations]);

  return (
    <div className="profile__chat">
      <div className="profile__chat-header">
        <h1>Tin nhắn</h1>
        <p>Tin nhắn của bạn.</p>
      </div>
      <div className="profile__chat-body">
        <div className="profile__chat-left">
          {conversations?.map((conversation: ConversationResponseDto) => (
            <div
              onClick={() => {
                if (active === conversation.conversationId) {
                  setActive(0);
                } else {
                  setActive(conversation.conversationId);
                }
              }}
            >
              <ChatItem
                key={conversation.conversationId}
                icon={
                  conversation.conversationAvatar ||
                  conversation?.toUser?.avatarUrl
                }
                name={conversation?.toUser?.username}
                content={conversation?.lastMessage}
                time={conversation?.lastMessageAt}
                isRead={false}
                focus={Number(active) === Number(conversation.conversationId)}
              />
            </div>
          ))}
        </div>
        <div className="profile__chat-right">
          <ChatPanel
            data={conversations?.find((item) => item.conversationId === active)}
          />
        </div>
      </div>
    </div>
  );
};
