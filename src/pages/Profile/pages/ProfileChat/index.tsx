import { useQuery } from "@tanstack/react-query";
import { getAllConversation } from "../../../../api/configs/chat.config";
import type { ConversationResponseDto } from "../../../../api/dtos/chat.dto";
import { ConverationEndpoint } from "../../../../api/endpoints/chat.endpoint";
import { ChatItem } from "../../../../components/Chat/ChatItem";
import { ChatPanel } from "../../../../components/Chat/ChatPanel";
import "../style.scss";
import { useEffect, useState } from "react";

export const ProfileChat = () => {
  const [active, setActive] = useState<number>();

  const { data: conversations } = useQuery({
    queryKey: [ConverationEndpoint.GET_CHAT_CONVERSATION],
    queryFn: () => getAllConversation(),
  });

  useEffect(() => {
    const firstId = conversations?.[0]?.conversationId;
    if (firstId) {
      setActive(firstId);
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
                focus={active === conversation.conversationId}
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
