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
