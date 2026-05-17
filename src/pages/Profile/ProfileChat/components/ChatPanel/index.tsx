import { useCallback, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { ConversationResponseDto } from "@api/dtos/chat.dto";
import { ChatComposer } from "../ChatComposer";
import { ChatEmptyState } from "../ChatEmptyState";
import { ChatHeader } from "../ChatHeader";
import { ChatLightbox } from "../ChatLightbox";
import { MessageList } from "../MessageList";
import { useChatDragDrop } from "../../hooks/useChatDragDrop";
import { useChatLightbox } from "../../hooks/useChatLightbox";
import { useChatMessages } from "../../hooks/useChatMessages";
import "./style.scss";

export interface ChatPanelProps {
  data?: ConversationResponseDto;
  currentUserId?: number;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ChatPanel = ({
  data,
  currentUserId,
  onBack,
  showBackButton,
}: ChatPanelProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [composerHeight, setComposerHeight] = useState(60);
  const {
    closeLightbox,
    currentImage,
    lightboxState,
    openImageViewer,
    showNextImage,
    showPrevImage,
  } = useChatLightbox();
  const {
    commitNickname,
    conversationView,
    isLoading,
    isNicknameEditing,
    messageBodyRef,
    messageEndRef,
    messageViews,
    muteByPreset,
    mutePresetItems,
    nicknameInput,
    setIsNicknameEditing,
    setNicknameInput,
    togglePin,
  } = useChatMessages(data, currentUserId);
  const { droppedFilesPayload, isDragActive } = useChatDragDrop(
    panelRef,
    Boolean(data?.conversationId),
  );

  const handleComposerHeightChange = useCallback((height: number) => {
    const normalizedHeight = Math.max(60, Math.ceil(height));
    setComposerHeight((currentHeight) =>
      currentHeight === normalizedHeight ? currentHeight : normalizedHeight,
    );
  }, []);

  const panelStyle: CSSProperties = {
    ["--chat-footer-height" as string]: `${composerHeight}px`,
  };

  if (!data || !conversationView) {
    return (
      <div className="chat-panel chat-panel--empty">
        <ChatEmptyState
          title="Chọn một hội thoại"
          description="Nội dung chat sẽ hiển thị tại đây khi bạn chọn hội thoại bên trái."
        />
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className={`chat-panel ${isDragActive ? "is-drag-active" : ""}`}
      style={panelStyle}
    >
      <ChatHeader
        conversation={conversationView}
        isNicknameEditing={isNicknameEditing}
        nicknameInput={nicknameInput}
        mutePresetItems={mutePresetItems}
        onBack={onBack}
        onCommitNickname={commitNickname}
        onMute={(preset) => void muteByPreset(preset)}
        onNicknameChange={setNicknameInput}
        onStartNicknameEditing={() => setIsNicknameEditing(true)}
        onTogglePin={() => void togglePin()}
        showBackButton={showBackButton}
      />

      {isDragActive && (
        <div className="chat-panel__drop-overlay" aria-hidden="true">
          <div className="chat-panel__drop-hint">Thả file tại đây</div>
        </div>
      )}

      <MessageList
        isLoading={isLoading}
        messageBodyRef={messageBodyRef}
        messageEndRef={messageEndRef}
        messages={messageViews}
        onOpenImageViewer={openImageViewer}
      />

      <div className="chat-panel__footer">
        <ChatComposer
          conversationId={data.conversationId}
          droppedFilesPayload={droppedFilesPayload}
          onComposerHeightChange={handleComposerHeightChange}
        />
      </div>

      <ChatLightbox
        currentImage={currentImage}
        imageCount={lightboxState?.images.length || 0}
        imageIndex={lightboxState?.index || 0}
        open={Boolean(lightboxState && currentImage)}
        onClose={closeLightbox}
        onNext={showNextImage}
        onPrev={showPrevImage}
      />
    </div>
  );
};
