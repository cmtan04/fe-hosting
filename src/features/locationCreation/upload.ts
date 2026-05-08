import type { UploadImageResponseDto } from "../../api/dtos/common.dto";
import { createEditableMediaFromUpload } from "./media";

//Upload tất cả các tệp lên server
export const uploadLocationMediaFiles = async (
  files: FileList | File[],
  uploadImage?: (payload: FormData) => Promise<UploadImageResponseDto>,
  uploadVideo?: (payload: FormData) => Promise<UploadImageResponseDto>,
  uploadFile?: (payload: FormData) => Promise<UploadImageResponseDto>,
) => {
  return Promise.all(
    Array.from(files).map(async (file) => {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      const formData = new FormData();
      
      let response;
      if (isVideo) {
        formData.append("video", file);
        response = await uploadVideo(formData);
      } else if (isImage) {
        formData.append("image", file);
        response = await uploadImage(formData);
      } else {
        formData.append("file", file);
        response = await uploadFile(formData);
      }

      return createEditableMediaFromUpload(
        response.imageUrl,
        file.type,
        file.name,
      );
    }),
  );
};
