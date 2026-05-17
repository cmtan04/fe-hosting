import { useCallback, useEffect, useMemo, useState } from "react";
import type { MessageAttachmentResponseDto } from "@api/dtos/chat.dto";
import type { ChatImagePreviewItem } from "../types";

export const useChatLightbox = () => {
  const [lightboxState, setLightboxState] = useState<{
    images: ChatImagePreviewItem[];
    index: number;
  } | null>(null);

  const currentImage = useMemo(
    () =>
      lightboxState ? lightboxState.images[lightboxState.index] : undefined,
    [lightboxState],
  );

  const closeLightbox = useCallback(() => {
    setLightboxState(null);
  }, []);

  const openImageViewer = useCallback(
    (images: MessageAttachmentResponseDto[], startIndex: number) => {
      const normalizedImages = images
        .filter((item) => Boolean(item.url))
        .map((item) => ({
          url: item.url,
          fileName: item.fileName,
        }));

      if (!normalizedImages.length) {
        return;
      }

      const safeIndex = Math.min(
        Math.max(startIndex, 0),
        normalizedImages.length - 1,
      );

      setLightboxState({
        images: normalizedImages,
        index: safeIndex,
      });
    },
    [],
  );

  const showPrevImage = useCallback(() => {
    setLightboxState((current) => {
      if (!current || current.images.length <= 1) {
        return current;
      }

      return {
        ...current,
        index:
          (current.index - 1 + current.images.length) % current.images.length,
      };
    });
  }, []);

  const showNextImage = useCallback(() => {
    setLightboxState((current) => {
      if (!current || current.images.length <= 1) {
        return current;
      }

      return {
        ...current,
        index: (current.index + 1) % current.images.length,
      };
    });
  }, []);

  useEffect(() => {
    if (!lightboxState) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxState]);

  useEffect(() => {
    if (!lightboxState) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevImage();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextImage();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, lightboxState, showNextImage, showPrevImage]);

  return {
    closeLightbox,
    currentImage,
    lightboxState,
    openImageViewer,
    showNextImage,
    showPrevImage,
  };
};
