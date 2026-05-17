import { Spin } from "antd";
import type { RefObject } from "react";
import type { MessageBubbleView, OpenImageViewerHandler } from "../../types";
import { ChatEmptyState } from "../ChatEmptyState";
import { MessageBubble } from "../MessageBubble";
import "./style.scss";

interface MessageListProps {
  isLoading?: boolean;
  messageBodyRef: RefObject<HTMLElement>;
  messageEndRef: RefObject<HTMLDivElement>;
  messages: MessageBubbleView[];
  onOpenImageViewer?: OpenImageViewerHandler;
}

export const MessageList = ({
  isLoading,
  messageBodyRef,
  messageEndRef,
  messages,
  onOpenImageViewer,
}: MessageListProps) => (
  <section ref={messageBodyRef} className="chat-message-list">
    {isLoading ? (
      <div className="chat-message-list__loading">
        <Spin />
      </div>
    ) : messages.length > 0 ? (
      messages.map((item) => (
        <MessageBubble
          key={item.message.id}
          item={item}
          onOpenImageViewer={onOpenImageViewer}
        />
      ))
    ) : (
      <ChatEmptyState title="Chưa có tin nhắn nào trong hội thoại này." />
    )}
    <div ref={messageEndRef} />
  </section>
);
