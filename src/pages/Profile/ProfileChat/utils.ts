import { isAxiosError } from "axios";
import type {
  ConversationResponseDto,
  MessageAttachmentResponseDto,
  MessageResponseDto,
  ParticipantDto,
} from "@api/dtos/chat.dto";
import type { UploadImageResponseDto } from "@api/dtos/common.dto";
import { uploadFile, uploadImage, uploadVideo } from "@api/configs/common.config";
import { MessageTypeEnum } from "@common/constants/constants";
import type {
  ChatConversationView,
  ChatMessageStatus,
  ComposerFileItem,
} from "./types";

export const getChatErrorMessage = (
  error: unknown,
  fallback = "Đã có lỗi xảy ra. Vui lòng thử lại.",
) => {
  if (isAxiosError(error)) {
    const apiMessage = error.response?.data?.message;

    if (typeof apiMessage === "string") {
      return apiMessage;
    }

    if (Array.isArray(apiMessage) && apiMessage[0]) {
      return String(apiMessage[0]);
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const getCurrentParticipant = (
  conversation?: ConversationResponseDto,
  currentUserId?: number,
): ParticipantDto | undefined => {
  if (!conversation || currentUserId == null) {
    return undefined;
  }

  return conversation.participants.find(
    (participant) => participant.userId === currentUserId,
  );
};

export const getConversationDisplayName = (
  conversation?: ConversationResponseDto,
  currentUserId?: number,
) => {
  const participant = getCurrentParticipant(conversation, currentUserId);

  return (
    participant?.nickname ||
    conversation?.conversationName ||
    conversation?.toUser?.fullName ||
    conversation?.toUser?.username ||
    "Cuộc trò chuyện"
  );
};

export const toConversationView = (
  conversation: ConversationResponseDto,
  currentUserId?: number,
): ChatConversationView => {
  const participant = getCurrentParticipant(conversation, currentUserId);
  const isSystemConversation =
    conversation.conversationType === MessageTypeEnum.RENT ||
    conversation.conversationType === MessageTypeEnum.CONTACT;

  return {
    conversation,
    conversationId: conversation.conversationId,
    displayName: getConversationDisplayName(conversation, currentUserId),
    avatarUrl: conversation.conversationAvatar || conversation.toUser?.avatarUrl || "",
    email: conversation.toUser?.email || "",
    preview: isSystemConversation
      ? "Tư vấn đặt phòng"
      : conversation.lastMessagePreview || "Không có tin nhắn nào",
    lastMessageAt: conversation.lastMessageAt || undefined,
    unreadCount: conversation.unreadCount || 0,
    isPinned: !!participant?.isPinned,
    isRead: conversation.unreadCount === 0,
    type: conversation.conversationType,
  };
};

export const isChatMessageStatus = (
  status?: string,
): status is ChatMessageStatus =>
  status === "SENT" || status === "DELIVERED" || status === "READ";

export const getMessageStatusLabel = (status?: ChatMessageStatus) => {
  if (status === "READ") return "Đã đọc";
  if (status === "DELIVERED") return "Đã nhận";
  if (status === "SENT") return "Đã gửi";
  return "";
};

export const formatFileSize = (size?: number) => {
  if (!size) return "";

  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export const getImageDimensions = async (
  file: File,
): Promise<{ width: number; height: number } | undefined> => {
  if (!file.type.startsWith("image/")) {
    return undefined;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    return await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        const image = new Image();

        image.onload = () => {
          resolve({
            width: image.naturalWidth,
            height: image.naturalHeight,
          });
        };

        image.onerror = () => {
          reject(new Error("Cannot read image dimensions"));
        };

        image.src = objectUrl;
      },
    );
  } catch {
    return undefined;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const uploadChatFile = (file: File): Promise<UploadImageResponseDto> => {
  const formData = new FormData();

  if (file.type.startsWith("image/")) {
    formData.append("image", file);
    return uploadImage(formData);
  }

  if (file.type.startsWith("video/")) {
    formData.append("video", file);
    return uploadVideo(formData);
  }

  formData.append("file", file);
  return uploadFile(formData);
};

export const revokeComposerPreviews = (files: ComposerFileItem[]) => {
  files.forEach((item) => {
    if (item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }
  });
};

export const splitAttachments = (attachments?: MessageAttachmentResponseDto[]) => {
  const normalizedAttachments = attachments || [];

  return {
    imageAttachments: normalizedAttachments.filter((item) =>
      item.mimeType?.startsWith("image/"),
    ),
    videoAttachments: normalizedAttachments.filter((item) =>
      item.mimeType?.startsWith("video/"),
    ),
    fileAttachments: normalizedAttachments.filter(
      (item) =>
        !item.mimeType?.startsWith("image/") &&
        !item.mimeType?.startsWith("video/"),
    ),
  };
};

export const sortMessagesAsc = (messages?: MessageResponseDto[]) =>
  [...(messages ?? [])].sort(
    (left, right) =>
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );
