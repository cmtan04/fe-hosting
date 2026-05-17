import { Avatar, Badge, Tooltip, Typography } from "antd";
import { PushpinFilled } from "@ant-design/icons";
import { formatLastMessageAt } from "@common/contexts/format";
import type { ChatConversationView } from "../../types";
import "./style.scss";

interface ConversationItemProps {
  conversation: ChatConversationView;
  isActive: boolean;
  onSelect: (conversationId: number) => void;
}

export const ConversationItem = ({
  conversation,
  isActive,
  onSelect,
}: ConversationItemProps) => {
  const itemClassName = [
    "chat-conversation-item",
    isActive ? "is-active" : "",
    conversation.unreadCount > 0 ? "is-unread" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={itemClassName}
      onClick={() => onSelect(conversation.conversationId)}
      aria-pressed={isActive}
    >
      <Badge
        count={conversation.unreadCount}
        size="small"
        overflowCount={99}
        offset={[-2, 34]}
      >
        <Avatar size={46} src={conversation.avatarUrl}>
          {conversation.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </Badge>

      <span className="chat-conversation-item__content">
        <span className="chat-conversation-item__top">
          <Typography.Text
            className="chat-conversation-item__name"
            ellipsis
            strong={conversation.unreadCount > 0}
          >
            {conversation.displayName}
          </Typography.Text>
          {conversation.isPinned && (
            <Tooltip title="Đã ghim">
              <PushpinFilled className="chat-conversation-item__pin" />
            </Tooltip>
          )}
        </span>

        <span className="chat-conversation-item__bottom">
          <Typography.Text className="chat-conversation-item__preview" ellipsis>
            {conversation.preview}
          </Typography.Text>
          <span className="chat-conversation-item__time">
            {conversation.lastMessageAt
              ? formatLastMessageAt(conversation.lastMessageAt)
              : ""}
          </span>
        </span>
      </span>
    </button>
  );
};
