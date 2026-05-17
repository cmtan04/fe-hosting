import { List, Spin, Typography } from "antd";
import type { ChatConversationView } from "../../types";
import { ChatEmptyState } from "../ChatEmptyState";
import { ConversationItem } from "../ConversationItem";
import "./style.scss";

interface ConversationListProps {
  conversations: ChatConversationView[];
  activeConversationId?: number;
  isLoading?: boolean;
  onSelectConversation: (conversationId: number) => void;
}

export const ConversationList = ({
  conversations,
  activeConversationId,
  isLoading,
  onSelectConversation,
}: ConversationListProps) => (
  <aside className="chat-conversation-list">
    <div className="chat-conversation-list__header">
      <Typography.Title level={5}>Hội thoại</Typography.Title>
      {conversations.length > 0 && <span>{conversations.length}</span>}
    </div>

    {isLoading ? (
      <div className="chat-conversation-list__loading">
        <Spin />
      </div>
    ) : conversations.length === 0 ? (
      <ChatEmptyState title="Không có cuộc trò chuyện nào." />
    ) : (
      <List
        dataSource={conversations}
        rowKey={(item) => item.conversationId}
        renderItem={(conversation) => (
          <List.Item>
            <ConversationItem
              conversation={conversation}
              isActive={conversation.conversationId === activeConversationId}
              onSelect={onSelectConversation}
            />
          </List.Item>
        )}
      />
    )}
  </aside>
);
