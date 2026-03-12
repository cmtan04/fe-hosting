import { useQuery } from "@tanstack/react-query";
import { getUserPRofile } from "../../../api/configs/user.config";
import { UserEndpoint } from "../../../api/endpoints/user.endpoint";
import { ChatInput } from "../ChatInput";
import { ChatLabel } from "../ChatLabel";
import type { ConversationResponseDto } from "../../../api/dtos/chat.dto";
import { data } from "react-router-dom";
import { ConverationEndpoint } from "../../../api/endpoints/chat.endpoint";
import {
  getAllConversation,
  getConversationMessages,
} from "../../../api/configs/chat.config";
import { useState } from "react";

export interface ChatPanelProps {
  data?: ConversationResponseDto;
}

interface Conversation {
  conversationId: number;
  page: number;
  size: number;
}

export const ChatPanel = (props: ChatPanelProps) => {
  const [conversation, setConversation] = useState<Conversation>({
    conversationId: props.data?.conversationId || 0,
    page: 1,
    size: 20,
  });

  const { data: message } = useQuery({
    queryKey: [ConverationEndpoint.GET_CHAT_CONVERSATION_MESSAGE, conversation],
    queryFn: () =>
      getConversationMessages(conversation.conversationId, {
        page: conversation.page,
        size: conversation.size,
      }),

    enabled: !!props.data?.conversationId,
  });

  return (
    <>
      {props.data && (
        <div className="chat__panel">
          <div className="chat__panel-header">
            <div className="chat__panel-header-left">
              <img
                src={props.data?.toUser?.avatarUrl}
                alt={props.data?.toUser?.avatarUrl}
              />
            </div>
            <div className="chat__panel-header-right">
              <p className={`line-1`}>{props.data?.toUser?.username}</p>
              <p className="line-2">{props.data?.toUser?.email}</p>
            </div>
          </div>
          <div className="chat__panel-body">
            {message ? (
              <>
                {message.map((item) => (
                  <ChatLabel
                    isYour={item.isYour}
                    isRead={item.isRead}
                    timeLine={item.timeLine}
                    content={item.content}
                    avartar={item.avartar}
                  />
                ))}
              </>
            ) : (
              <ChatLabel
                isYour={true}
                isRead={false}
                timeLine={props.data.conversationCreatedAt}
                content={props.data.lastMessage || "Không có tin nhắn nào"}
                avartar={props.data.toUser?.avatarUrl || ""}
              />
            )}
          </div>
          <div className="chat__panel-footer">
            <ChatInput />
          </div>
        </div>
      )}
    </>
  );
};
