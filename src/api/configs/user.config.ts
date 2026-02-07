import axiosClient from "../axiosClient";
import type {
  UserProfileResponseDto,
  UserUpdatePayloadDto,
} from "../dtos/user.dto";
import { UserEndpoint } from "../endpoints/user.endpoint";

export const getUserPRofile = async (): Promise<UserProfileResponseDto> => {
  const response = await axiosClient.get(UserEndpoint.GET_USER_INFORMATION);
  return response.data;
};

export const updateUserProfile = async (
  payload: UserUpdatePayloadDto,
): Promise<UserProfileResponseDto> => {
  const response = await axiosClient.put(
    UserEndpoint.UPDATE_USER_INFORMATION,
    payload,
  );
  return response.data;
};
