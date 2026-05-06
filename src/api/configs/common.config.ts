import type { UploadImageResponseDto } from "../dtos/common.dto";
import { CommonEndpoint } from "../endpoints/common.endpoint";
import uploadAxiosClient from "../uploadAxiosClient";

export const uploadImage = async (
  payload: FormData,
): Promise<UploadImageResponseDto> => {
  const response = await uploadAxiosClient.post(
    CommonEndpoint.UPLOAD_IMAGE,
    payload,
  );
  return response.data;
};
export const uploadVideo = async (
  payload: FormData,
): Promise<UploadImageResponseDto> => {
  const response = await uploadAxiosClient.post(
    CommonEndpoint.UPLOAD_VIDEO,
    payload,
  );
  return response.data;
};

export const uploadFile = async (
  payload: FormData,
): Promise<UploadImageResponseDto> => {
  const response = await uploadAxiosClient.post(
    CommonEndpoint.UPLOAD_FILE,
    payload,
  );
  return response.data;
};
