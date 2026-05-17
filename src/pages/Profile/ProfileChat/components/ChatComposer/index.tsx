import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { Button, Input, Popover, Spin, Tooltip, Upload, Typography } from "antd";
import type { UploadProps } from "antd";
import {
  CloseOutlined,
  FileOutlined,
  PaperClipOutlined,
  PlayCircleOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useEffect, useRef } from "react";
import type { MessageResponseDto } from "@api/dtos/chat.dto";
import { useChatComposer } from "../../hooks/useChatComposer";
import type { DroppedFilesPayload } from "../../hooks/useChatComposer";
import { formatFileSize } from "../../utils";
import "./style.scss";

interface ChatComposerProps {
  conversationId?: number;
  disabled?: boolean;
  droppedFilesPayload?: DroppedFilesPayload | null;
  onComposerHeightChange?: (height: number) => void;
  onMessageSent?: (message: MessageResponseDto) => void;
}

export const ChatComposer = ({
  conversationId,
  disabled,
  droppedFilesPayload,
  onComposerHeightChange,
  onMessageSent,
}: ChatComposerProps) => {
  const composerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const cursorPositionRef = useRef(0);
  const {
    addSelectedFiles,
    canSend,
    files,
    isBusy,
    isUploading,
    message,
    removeFile,
    sendMessage,
    setMessage,
    uploadStatus,
  } = useChatComposer({
    conversationId,
    disabled,
    droppedFilesPayload,
    onMessageSent,
  });

  const mediaFiles = files.filter(
    (item) =>
      item.file.type.startsWith("image/") || item.file.type.startsWith("video/"),
  );
  const documentFiles = files.filter(
    (item) =>
      !item.file.type.startsWith("image/") && !item.file.type.startsWith("video/"),
  );

  useEffect(() => {
    if (!onComposerHeightChange) {
      return;
    }

    const composerElement = composerRef.current;
    if (!composerElement) {
      return;
    }

    const emitComposerHeight = () => {
      onComposerHeightChange(composerElement.getBoundingClientRect().height);
    };

    emitComposerHeight();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(emitComposerHeight);
    observer.observe(composerElement);

    return () => {
      observer.disconnect();
    };
  }, [onComposerHeightChange]);

  const uploadProps: UploadProps = {
    accept: "image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt",
    beforeUpload: (file) => {
      addSelectedFiles([file]);
      return Upload.LIST_IGNORE;
    },
    disabled: isBusy,
    multiple: true,
    showUploadList: false,
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = cursorPositionRef.current;
    const nextMessage =
      message.slice(0, start) + emojiData.emoji + message.slice(start);

    setMessage(nextMessage);

    setTimeout(() => {
      const nextPosition = start + emojiData.emoji.length;
      textarea.setSelectionRange(nextPosition, nextPosition);
      textarea.focus();
    }, 0);
  };

  return (
    <div
      ref={composerRef}
      className={`chat-composer ${files.length > 0 ? "has-files" : ""}`}
    >
      <Upload {...uploadProps}>
        <Tooltip title="Dinh kem">
          <Button
            type="text"
            shape="circle"
            icon={<PaperClipOutlined />}
            disabled={isBusy}
            aria-label="Dinh kem file"
          />
        </Tooltip>
      </Upload>

      <div className="chat-composer__input-wrap">
        {uploadStatus && (
          <div className="chat-composer__upload-status" role="status">
            <Spin size="small" />
            <div className="chat-composer__upload-status-copy">
              <Typography.Text strong>
                {`Dang tai tep ${uploadStatus.currentIndex}/${uploadStatus.totalFiles}`}
              </Typography.Text>
              <Typography.Text ellipsis>
                {`${uploadStatus.currentFileName} - ${uploadStatus.elapsedSeconds}s`}
              </Typography.Text>
              {uploadStatus.isLongUpload && (
                <span>
                  Video hoac file lon co the can them thoi gian. UI van dang tai.
                </span>
              )}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="chat-composer__attachments">
            {mediaFiles.length > 0 && (
              <div className="chat-composer__media-strip">
                {mediaFiles.map((item) => (
                  <div
                    key={item.id}
                    className={`chat-composer__media-card ${
                      isUploading ? "is-uploading" : ""
                    }`}
                  >
                    {item.file.type.startsWith("image/") ? (
                      <img src={item.previewUrl} alt={item.file.name} />
                    ) : (
                      <div className="chat-composer__media-video">
                        {item.previewUrl ? (
                          <video preload="metadata" muted>
                            <source src={item.previewUrl} type={item.file.type} />
                          </video>
                        ) : (
                          <div className="chat-composer__media-video-fallback">
                            <PlayCircleOutlined />
                          </div>
                        )}
                        <div className="chat-composer__media-badge">
                          <PlayCircleOutlined />
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      className="chat-composer__media-remove"
                      disabled={isBusy}
                      onClick={() => removeFile(item.id)}
                      aria-label={`Xoa ${item.file.name}`}
                    >
                      <CloseOutlined />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {documentFiles.length > 0 && (
              <div className="chat-composer__files">
                {documentFiles.map((item) => (
                  <div
                    key={item.id}
                    className={`chat-composer__file ${
                      isUploading ? "is-uploading" : ""
                    }`}
                  >
                    <div className="chat-composer__file-document">
                      <FileOutlined />
                    </div>
                    <div className="chat-composer__file-meta">
                      <Typography.Text ellipsis>{item.file.name}</Typography.Text>
                      <span>{formatFileSize(item.file.size)}</span>
                    </div>
                    <Button
                      type="text"
                      shape="circle"
                      size="small"
                      icon={<CloseOutlined />}
                      disabled={isBusy}
                      onClick={() => removeFile(item.id)}
                      aria-label={`Xoa ${item.file.name}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Input.TextArea
          ref={textareaRef}
          value={message}
          placeholder="Nhap tin nhan"
          disabled={isBusy}
          autoSize={{ minRows: 1, maxRows: 4 }}
          onChange={(event) => setMessage(event.target.value)}
          onSelect={(event) => {
            cursorPositionRef.current = event.currentTarget.selectionStart;
          }}
          onClick={(event) => {
            cursorPositionRef.current = event.currentTarget.selectionStart;
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void sendMessage();
            }
          }}
        />
      </div>

      <div className="chat-composer__actions">
        <Popover
          trigger="click"
          placement="topRight"
          content={
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              autoFocusSearch={false}
              width={320}
              height={400}
            />
          }
        >
          <Tooltip title="Emoji">
            <Button
              type="text"
              shape="circle"
              icon={<SmileOutlined />}
              disabled={isBusy}
              aria-label="Mo bang emoji"
            />
          </Tooltip>
        </Popover>

        <Tooltip title="Gui">
          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            loading={isUploading}
            disabled={!canSend}
            onClick={() => void sendMessage()}
            aria-label="Gui tin nhan"
          />
        </Tooltip>
      </div>
    </div>
  );
};
