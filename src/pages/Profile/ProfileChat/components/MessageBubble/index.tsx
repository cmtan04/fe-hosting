import { Avatar, Typography } from "antd";
import { CheckOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { MessageType } from "@common/constants/constants";
import { formatLastMessageAt } from "@common/contexts/format";
import type { MessageBubbleView, OpenImageViewerHandler } from "../../types";
import { AttachmentPreview } from "../AttachmentPreview";
import { getMessageStatusLabel } from "../../utils";
import "./style.scss";

interface MessageBubbleProps {
  item: MessageBubbleView;
  onOpenImageViewer?: OpenImageViewerHandler;
}

export const MessageBubble = ({
  item,
  onOpenImageViewer,
}: MessageBubbleProps) => {
  const { message, isMine, avatarUrl, showStatus, messageStatus } = item;
  const statusLabel = getMessageStatusLabel(messageStatus);
  const attachments = message.attachments || [];
  const hasText = Boolean(message.content);
  const hasAttachments = attachments.length > 0;
  const hasMedia = attachments.some(
    (attachment) =>
      attachment.mimeType?.startsWith("image/") ||
      attachment.mimeType?.startsWith("video/"),
  );
  const bodyClassName = [
    "chat-message-bubble__body",
    !hasText && hasMedia ? "chat-message-bubble__body--media-only" : "",
    hasAttachments ? "chat-message-bubble__body--with-attachments" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`chat-message-bubble ${isMine ? "is-mine" : ""}`}>
      {!isMine && (
        <Avatar size={28} src={avatarUrl}>
          {(avatarUrl || "U").charAt(0).toUpperCase()}
        </Avatar>
      )}

      <div className="chat-message-bubble__content">
        <div className={bodyClassName}>
          {message.type === MessageType.SYSTEM ? (
            <Typography.Paragraph
              className="chat-message-bubble__text"
              dangerouslySetInnerHTML={{ __html: message.content || "" }}
            />
          ) : (
            <>
              {message.content && (
                hasAttachments ? (
                  <div className="chat-message-bubble__text-bubble">
                    <Typography.Paragraph className="chat-message-bubble__text">
                      {message.content}
                    </Typography.Paragraph>
                  </div>
                ) : (
                  <Typography.Paragraph className="chat-message-bubble__text">
                    {message.content}
                  </Typography.Paragraph>
                )
              )}
              <AttachmentPreview
                attachments={attachments}
                onOpenImageViewer={onOpenImageViewer}
              />
            </>
          )}
        </div>

        <div className="chat-message-bubble__meta">
          <span>{formatLastMessageAt(message.createdAt)}</span>
          {showStatus && messageStatus && (
            <>
              {messageStatus === "SENT" ? (
                <CheckOutlined aria-label={statusLabel} />
              ) : (
                <CheckCircleOutlined aria-label={statusLabel} />
              )}
              <span>{statusLabel}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
