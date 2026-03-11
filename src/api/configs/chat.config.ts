import axiosClient from "../axiosClient";
import type { ConversationResponseDto } from "../dtos/chat.dto";
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
): Promise<any[]> => {
  const response = await axiosClient.get(
    ConverationEndpoint.GET_CHAT_CONVERSATION_MESSAGE,
    {
      params: { conversationId: conversationId, ...filter },
    },
  );
  return response.data;
};
