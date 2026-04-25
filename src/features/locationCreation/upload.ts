import type { UploadImageResponseDto } from "../../api/dtos/common.dto";
import { createEditableMediaFromUpload } from "./media";

export const uploadLocationMediaFiles = async (
  files: FileList | File[],
  uploadFile: (payload: FormData) => Promise<UploadImageResponseDto>,
) => {
  return Promise.all(
    Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await uploadFile(formData);

      return createEditableMediaFromUpload(
        response.imageUrl,
        file.type,
        file.name,
      );
    }),
  );
};
