import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

const isDraggingNativeFiles = (event: DragEvent) =>
  Array.from(event.dataTransfer?.types || []).includes("Files");

export const useChatDragDrop = (
  panelRef: RefObject<HTMLElement | HTMLDivElement>,
  enabled: boolean,
) => {
  const dragCounterRef = useRef(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [droppedFilesPayload, setDroppedFilesPayload] = useState<{
    id: number;
    files: File[];
  } | null>(null);

  const resetDragState = useCallback(() => {
    dragCounterRef.current = 0;
    setIsDragActive(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      resetDragState();
      return;
    }

    const handleWindowDragEnter = (event: DragEvent) => {
      if (!isDraggingNativeFiles(event)) return;

      event.preventDefault();
      dragCounterRef.current += 1;
      setIsDragActive(true);
    };

    const handleWindowDragOver = (event: DragEvent) => {
      if (!isDraggingNativeFiles(event)) return;

      event.preventDefault();
    };

    const handleWindowDragLeave = (event: DragEvent) => {
      if (!isDraggingNativeFiles(event)) return;

      event.preventDefault();
      dragCounterRef.current -= 1;

      if (dragCounterRef.current <= 0) {
        resetDragState();
      }
    };

    const handleWindowDrop = (event: DragEvent) => {
      if (!isDraggingNativeFiles(event)) return;

      event.preventDefault();
      resetDragState();
    };

    globalThis.addEventListener("dragenter", handleWindowDragEnter);
    globalThis.addEventListener("dragover", handleWindowDragOver);
    globalThis.addEventListener("dragleave", handleWindowDragLeave);
    globalThis.addEventListener("drop", handleWindowDrop);

    return () => {
      globalThis.removeEventListener("dragenter", handleWindowDragEnter);
      globalThis.removeEventListener("dragover", handleWindowDragOver);
      globalThis.removeEventListener("dragleave", handleWindowDragLeave);
      globalThis.removeEventListener("drop", handleWindowDrop);
    };
  }, [enabled, resetDragState]);

  useEffect(() => {
    const panelElement = panelRef.current;
    if (!panelElement || !enabled) return;

    const handleBodyDragOver = (event: DragEvent) => {
      if (!isDraggingNativeFiles(event)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    const handleBodyDrop = (event: DragEvent) => {
      if (!isDraggingNativeFiles(event)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const droppedFiles = Array.from(event.dataTransfer?.files || []);
      if (!droppedFiles.length) {
        resetDragState();
        return;
      }

      setDroppedFilesPayload({ id: Date.now(), files: droppedFiles });
      resetDragState();
    };

    panelElement.addEventListener("dragover", handleBodyDragOver);
    panelElement.addEventListener("drop", handleBodyDrop);

    return () => {
      panelElement.removeEventListener("dragover", handleBodyDragOver);
      panelElement.removeEventListener("drop", handleBodyDrop);
    };
  }, [enabled, panelRef, resetDragState]);

  return {
    droppedFilesPayload,
    isDragActive,
  };
};
