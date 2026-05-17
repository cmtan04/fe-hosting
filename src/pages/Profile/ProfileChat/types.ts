import type {
  ConversationResponseDto,
  MessageAttachmentResponseDto,
  MessageResponseDto,
} from "@api/dtos/chat.dto";

export interface ChatConversationView {
  conversation: ConversationResponseDto;
  conversationId: number;
  displayName: string;
  avatarUrl: string;
  email: string;
  preview: string;
  lastMessageAt?: string;
  unreadCount: number;
  isPinned: boolean;
  isRead: boolean;
  type?: string;
}

export interface ChatImagePreviewItem {
  url: string;
  fileName?: string;
}

export interface ComposerFileItem {
  id: string;
  file: File;
  previewUrl?: string;
}

export type ChatMessageStatus = "SENT" | "DELIVERED" | "READ";

export interface MessageBubbleView {
  message: MessageResponseDto;
  isMine: boolean;
  avatarUrl: string;
  showStatus: boolean;
  messageStatus?: ChatMessageStatus;
}

export type OpenImageViewerHandler = (
  images: MessageAttachmentResponseDto[],
  startIndex: number,
) => void;
