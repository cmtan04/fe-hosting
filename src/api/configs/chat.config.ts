import axiosClient from "../axiosClient";
import type {
  ConversationCreateResponseDto,
  ConversationResponseDto,
  MessageResponseDto,
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
