import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sendChatMessage } from "@api/configs/chat.config";
import type {
  MessageResponseDto,
  SendMessageAttachmentDto,
} from "@api/dtos/chat.dto";
import { NOTI_ERROR } from "@common/constants/constants";
import { useNotification } from "@providers/notificationProvider";
import type { ComposerFileItem } from "../types";
import {
  getChatErrorMessage,
  getImageDimensions,
  revokeComposerPreviews,
  uploadChatFile,
} from "../utils";

export interface DroppedFilesPayload {
  id: number;
  files: File[];
}

interface UseChatComposerParams {
  conversationId?: number;
  disabled?: boolean;
  droppedFilesPayload?: DroppedFilesPayload | null;
  onMessageSent?: (message: MessageResponseDto) => void;
}

interface UploadingState {
  currentFileName: string;
  currentIndex: number;
  totalFiles: number;
  startedAt: number;
}

export const useChatComposer = ({
  conversationId,
  disabled,
  droppedFilesPayload,
  onMessageSent,
}: UseChatComposerParams) => {
  const { showNotification } = useNotification();
  const [files, setFiles] = useState<ComposerFileItem[]>([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingState, setUploadingState] = useState<UploadingState | null>(
    null,
  );
  const [uploadElapsedSeconds, setUploadElapsedSeconds] = useState(0);
  const filesRef = useRef<ComposerFileItem[]>([]);
  const isBusy = disabled || isSending || isUploading;

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  const addSelectedFiles = useCallback((selectedFiles: File[]) => {
    if (!selectedFiles.length) return;

    setFiles((currentFiles) => [
      ...currentFiles,
      ...selectedFiles.map((file) => ({
        id: `${file.name}-${file.lastModified}-${file.size}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        file,
        previewUrl:
          file.type.startsWith("image/") || file.type.startsWith("video/")
            ? URL.createObjectURL(file)
            : undefined,
      })),
    ]);
  }, []);

  useEffect(() => {
    if (!droppedFilesPayload?.files?.length) {
      return;
    }

    addSelectedFiles(droppedFilesPayload.files);
  }, [addSelectedFiles, droppedFilesPayload]);

  useEffect(() => {
    return () => {
      revokeComposerPreviews(filesRef.current);
    };
  }, []);

  useEffect(() => {
    if (!uploadingState) {
      setUploadElapsedSeconds(0);
      return;
    }

    const updateElapsed = () => {
      setUploadElapsedSeconds(
        Math.max(1, Math.floor((Date.now() - uploadingState.startedAt) / 1000)),
      );
    };

    updateElapsed();
    const intervalId = window.setInterval(updateElapsed, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [uploadingState]);

  const removeFile = useCallback((fileId: string) => {
    setFiles((currentFiles) => {
      const removedFile = currentFiles.find((item) => item.id === fileId);
      if (removedFile?.previewUrl) {
        URL.revokeObjectURL(removedFile.previewUrl);
      }

      return currentFiles.filter((item) => item.id !== fileId);
    });
  }, []);

  const resetComposer = useCallback(() => {
    revokeComposerPreviews(files);
    setFiles([]);
    setMessage("");
  }, [files]);

  const uploadAttachments = useCallback(
    async (
      selectedFiles: ComposerFileItem[],
    ): Promise<SendMessageAttachmentDto[]> => {
      const startedAt = Date.now();
      const attachments: SendMessageAttachmentDto[] = [];

      for (const [index, { file }] of selectedFiles.entries()) {
        setUploadingState({
          currentFileName: file.name,
          currentIndex: index + 1,
          totalFiles: selectedFiles.length,
          startedAt,
        });

        try {
          const [uploadResult, dimensions] = await Promise.all([
            uploadChatFile(file),
            getImageDimensions(file),
          ]);

          attachments.push({
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            url: uploadResult.imageUrl,
            width: dimensions?.width,
            height: dimensions?.height,
          });
        } catch (error) {
          throw new Error(
            `Khong the tai file ${file.name}: ${getChatErrorMessage(error)}`,
          );
        }
      }

      return attachments;
    },
    [],
  );

  const sendMessage = useCallback(async () => {
    const trimmedMessage = message.trim();
    const hasFiles = files.length > 0;

    if ((!trimmedMessage && !hasFiles) || !conversationId || isBusy) {
      return;
    }

    setIsSending(true);
    setIsUploading(hasFiles);

    try {
      const mediaFiles = files.filter(
        (item) =>
          item.file.type.startsWith("image/") ||
          item.file.type.startsWith("video/"),
      );
      const documentFiles = files.filter(
        (item) =>
          !item.file.type.startsWith("image/") &&
          !item.file.type.startsWith("video/"),
      );
      let hasUsedTextContent = false;

      if (mediaFiles.length > 0) {
        const mediaAttachments = await uploadAttachments(mediaFiles);
        const createdMediaMessage = await sendChatMessage({
          conversationId,
          content: trimmedMessage || undefined,
          attachments: mediaAttachments,
        });

        if (createdMediaMessage) {
          onMessageSent?.(createdMediaMessage);
        }

        hasUsedTextContent = Boolean(trimmedMessage);
      }

      for (const documentFile of documentFiles) {
        const [documentAttachment] = await uploadAttachments([documentFile]);
        const createdDocumentMessage = await sendChatMessage({
          conversationId,
          content:
            !hasUsedTextContent && trimmedMessage ? trimmedMessage : undefined,
          attachments: documentAttachment ? [documentAttachment] : undefined,
        });

        if (createdDocumentMessage) {
          onMessageSent?.(createdDocumentMessage);
        }

        hasUsedTextContent = hasUsedTextContent || Boolean(trimmedMessage);
      }

      if (!hasFiles) {
        const createdTextMessage = await sendChatMessage({
          conversationId,
          content: trimmedMessage || undefined,
        });

        if (createdTextMessage) {
          onMessageSent?.(createdTextMessage);
        }
      }

      resetComposer();
    } catch (error) {
      showNotification(getChatErrorMessage(error), NOTI_ERROR);
    } finally {
      setIsSending(false);
      setIsUploading(false);
      setUploadingState(null);
    }
  }, [
    conversationId,
    files,
    isBusy,
    message,
    onMessageSent,
    resetComposer,
    showNotification,
    uploadAttachments,
  ]);

  const canSend = useMemo(
    () => Boolean(message.trim() || files.length > 0) && !isBusy,
    [files.length, isBusy, message],
  );

  const uploadStatus = useMemo(() => {
    if (!uploadingState) {
      return null;
    }

    return {
      currentFileName: uploadingState.currentFileName,
      currentIndex: uploadingState.currentIndex,
      totalFiles: uploadingState.totalFiles,
      elapsedSeconds: uploadElapsedSeconds,
      isLongUpload: uploadElapsedSeconds >= 8,
    };
  }, [uploadElapsedSeconds, uploadingState]);

  return {
    addSelectedFiles,
    canSend,
    files,
    isBusy,
    isSending,
    isUploading,
    message,
    removeFile,
    sendMessage,
    setMessage,
    uploadStatus,
  };
};
