import axiosClient from "../axiosClient";
import type {
  ConversationParticipantSettingsResponseDto,
  ConversationCreateResponseDto,
  ConversationResponseDto,
  MessageResponseDto,
  MuteConversationPayloadDto,
  PinConversationPayloadDto,
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
