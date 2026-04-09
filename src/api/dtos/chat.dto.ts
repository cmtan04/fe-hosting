import type { UserResponseDto } from "./user.dto";

export interface GetAllConverationResponseDto {
  id: number;
  type: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantDto {
  id: number;
  conversationId: number;
  userId: number;
  unreadCount: number;
  lastReadMessageId: number | null;
  lastReadAt: string | null;
  muteUntil: string | null;
  isPinned: boolean;
  nickname?: string | null;
  deletedAt: string | null;
  joinedAt: string;
}
export interface ConversationResponseDto {
  conversationId: number;
  conversationType: string;
  conversationStatus: string;
  conversationName: string | null;
  conversationAvatar: string | null;
  lastMessageId: number | null;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  lastMessageType: string | null;
  conversationCreatedAt: string;
  unreadCount: number;
  lastReadMessageId: number | null;
  participants: ParticipantDto[];
  toUser: UserResponseDto | null;
}

export interface ConversationCreateResponseDto {
  id: number;
  createdByUserId: number;
  status: string;
  type: string;
  name: string | null;
  avatar: string | null;
  lastMessageId: number | null;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  lastMessageType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessageResponseDto {
  id: number;
  conversationId: number;
  senderId: number;
  senderAvatarUrl?: string;
  type: string;
  content?: string | null;
  status?: string;
  replyToMessageId?: number | null;
  attachments?: MessageAttachmentResponseDto[];
  metadata?: Record<string, unknown> | null;
  editedAt?: string | null;
  deletedAt?: string | null;
  deletedByUserId?: number | null;
  createdAt: string;
  updatedAt?: string;
}

export interface MessageAttachmentResponseDto extends SendMessageAttachmentDto {
  id?: number;
  messageId?: number;
  createdAt?: string;
}

export interface SendMessageAttachmentDto {
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  storageKey?: string;
  width?: number;
  height?: number;
}

export interface SendMessagePayloadDto {
  conversationId: number;
  content?: string;
  type?: string;
  replyToMessageId?: number | null;
  attachments?: SendMessageAttachmentDto[];
}

export type MuteConversationPreset =
  | "15m"
  | "1h"
  | "8h"
  | "24h"
  | "no end time yet";

export interface SetConversationNicknamePayloadDto {
  conversationId: number;
  nickname: string | null;
}

export interface PinConversationPayloadDto {
  conversationId: number;
  isPinned: boolean;
}

export interface MuteConversationPayloadDto {
  conversationId: number;
  preset: MuteConversationPreset;
}

export interface ConversationParticipantSettingsResponseDto extends ParticipantDto {}
