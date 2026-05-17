import { Empty } from "antd";
import "./style.scss";

interface ChatEmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export const ChatEmptyState = ({
  title,
  description,
  className,
}: ChatEmptyStateProps) => (
  <div className={`chat-empty-state ${className || ""}`}>
    <Empty description={false}>
      <p className="chat-empty-state__title">{title}</p>
      {description && (
        <p className="chat-empty-state__description">{description}</p>
      )}
    </Empty>
  </div>
);
