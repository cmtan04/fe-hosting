import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useRef, useState } from "react";
import type { MessageResponseDto } from "../../../api/dtos/chat.dto";
import emoji from "../../../assets/svg/emoji.svg";
import remove from "../../../assets/svg/remove.svg";
import send from "../../../assets/svg/send.svg";
import { chatSocket } from "../../../socket/domains/chat.socket";

export interface ChatInputProps {
  conversationId: number;
  disabled?: boolean;
  onMessageSent?: (message: MessageResponseDto) => void;
}

export const ChatInput = (props: ChatInputProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const cursorPositionRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles = Array.from(selectedFiles);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index as number] as string);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = cursorPositionRef.current;
    const newMessage =
      message.slice(0, start) + emojiData.emoji + message.slice(start);

    setMessage(newMessage);
    setShowEmojiPicker(false);

    setTimeout(() => {
      const newPosition = start + emojiData.emoji.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  const resetComposer = () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview));
    setFiles([]);
    setPreviews([]);
    setMessage("");
  };

  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !props.conversationId) {
      return;
    }

    setIsSending(true);

    try {
      const createdMessage = await chatSocket.sendMessage({
        conversationId: props.conversationId,
        content: trimmedMessage || undefined,
      });

      if (createdMessage) {
        props.onMessageSent?.(createdMessage);
      }

      resetComposer();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat__input">
      <span className="chat__input-col-1">
        <label htmlFor="upload" className="btn-upload">
          <input
            id="upload"
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleUploadImage}
            disabled={props.disabled || isSending}
          />
        </label>
      </span>
      <div className="chat__input-col-2">
        {previews.length > 0 && (
          <figure className="image_container">
            {previews.map((preview, index) => (
              <div key={index} className="image_container-item">
                <img
                  src={preview}
                  alt={`preview-${index}`}
                  className="image_container-item"
                />
                <button
                  type="button"
                  className="image_container-action"
                  onClick={() => removeImage(index)}
                  disabled={props.disabled || isSending}
                >
                  <img src={remove} />
                </button>
              </div>
            ))}
          </figure>
        )}

        <textarea
          ref={textareaRef}
          placeholder={"Nhập tin nhắn"}
          className="chat__input-col-2-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={props.disabled || isSending}
          onSelect={(e) => {
            cursorPositionRef.current = e.currentTarget.selectionStart;
          }}
          onClick={(e) => {
            cursorPositionRef.current = e.currentTarget.selectionStart;
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              await sendMessage();
            }
          }}
          rows={1}
        />
      </div>
      <div className="chat__input-col-3">
        <img
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          src={emoji}
          alt="File"
          className="chat__input-emoji"
        />

        <img
          onClick={() => sendMessage()}
          src={send}
          alt="send"
          className="chat__input-send"
        />

        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="chat__input-emoji-picker">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              autoFocusSearch={false}
              width={320}
              height={400}
            />
          </div>
        )}
      </div>
    </div>
  );
};
