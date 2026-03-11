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
  isMuted: boolean;
  isPinned: boolean;
  isDeleted: boolean;
}
export interface ConversationResponseDto {
  conversationId: number;
  conversationType: string;
  conversationName: string;
  conversationAvatar: string;
  lastMessage: string;
  lastMessageAt: string;
  conversationCreatedAt: string;
  participants: ParticipantDto[];
  toUser: UserResponseDto;
}
