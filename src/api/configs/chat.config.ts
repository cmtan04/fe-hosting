import axiosClient from "../axiosClient";
import type {
  MessageAttachmentResponseDto,
  ConversationParticipantSettingsResponseDto,
  ConversationCreateResponseDto,
  ConversationResponseDto,
  MessageResponseDto,
  MuteConversationPayloadDto,
  PinConversationPayloadDto,
  SendMessagePayloadDto,
  SetConversationNicknamePayloadDto,
} from "../dtos/chat.dto";
import { ConverationEndpoint } from "../endpoints/chat.endpoint";

export const getAllConversation = async (): Promise<
  ConversationResponseDto[]
> => {
  const response = await axiosClient.get(
    ConverationEndpoint.GET_CHAT_CONVERSATION,
  );
  return response.data;
};

export const getConversationMessages = async (
  conversationId: number,
  filter: any,
): Promise<MessageResponseDto[]> => {
  const response = await axiosClient.get(
    ConverationEndpoint.GET_CHAT_CONVERSATION_MESSAGE,
    {
      params: { conversationId: conversationId, ...filter },
    },
  );
  return response.data;
};

export const createConversation = async (
  toUserCd: string,
  type: string,
  locationCd?: string,
): Promise<ConversationCreateResponseDto> => {
  const response = await axiosClient.post(
    ConverationEndpoint.CREATE_CONVERSATION,
    {
      toUserCd,
      type,
      locationCd,
    },
  );
  return response.data;
};

export const setConversationNickname = async (
  payload: SetConversationNicknamePayloadDto,
): Promise<ConversationParticipantSettingsResponseDto> => {
  const response = await axiosClient.post(
    ConverationEndpoint.SET_CHAT_NICKNAME,
    payload,
  );
  return response.data;
};

export const pinConversation = async (
  payload: PinConversationPayloadDto,
): Promise<ConversationParticipantSettingsResponseDto> => {
  const response = await axiosClient.post(
    ConverationEndpoint.PIN_CHAT_CONVERSATION,
    payload,
  );
  return response.data;
};

export const muteConversation = async (
  payload: MuteConversationPayloadDto,
): Promise<ConversationParticipantSettingsResponseDto> => {
  const response = await axiosClient.post(
    ConverationEndpoint.MUTE_CHAT_CONVERSATION,
    payload,
  );
  return response.data;
};

export const sendChatMessage = async (
  payload: SendMessagePayloadDto,
): Promise<MessageResponseDto> => {
  const response = await axiosClient.post(
    ConverationEndpoint.SEND_CHAT_MESSAGE,
    payload,
  );
  return response.data;
};

const getAttachmentEndpoint = (
  attachmentId: number,
  mode: "view" | "download",
) =>
  `${ConverationEndpoint.VIEW_CHAT_ATTACHMENT}/${attachmentId}/${mode}`;

const getFileNameFromDisposition = (
  contentDisposition?: string,
): string | null => {
  if (!contentDisposition) {
    return null;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const fallbackMatch = contentDisposition.match(/filename="([^"]+)"/i);
  return fallbackMatch?.[1] ?? null;
};

export const viewChatAttachment = async (
  attachment: MessageAttachmentResponseDto,
): Promise<void> => {
  if (!attachment.id) {
    throw new Error("Attachment id is required");
  }

  const popup = globalThis.open("", "_blank", "noopener,noreferrer");

  const response = await axiosClient.get(
    getAttachmentEndpoint(attachment.id, "view"),
    {
      responseType: "blob",
    },
  );

  const blobUrl = URL.createObjectURL(response.data);

  if (popup) {
    popup.location.href = blobUrl;
  } else {
    globalThis.location.href = blobUrl;
  }

  globalThis.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
};

export const downloadChatAttachment = async (
  attachment: MessageAttachmentResponseDto,
): Promise<void> => {
  if (!attachment.id) {
    throw new Error("Attachment id is required");
  }

  const response = await axiosClient.get(
    getAttachmentEndpoint(attachment.id, "download"),
    {
      responseType: "blob",
    },
  );

  const downloadName =
    attachment.fileName ||
    getFileNameFromDisposition(response.headers["content-disposition"]) ||
    "attachment";
  const blobUrl = URL.createObjectURL(response.data);
  const anchor = document.createElement("a");

  anchor.href = blobUrl;
  anchor.download = downloadName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(blobUrl);
};
