import { useMutation } from "@tanstack/react-query";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useRef, useState } from "react";
import { uploadImage } from "../../../api/configs/common.config";
import type { ChatAndCommentDto } from "../../../api/dtos/common.dto";
import emoji from "../../../assets/svg/emoji.svg";
import remove from "../../../assets/svg/remove.svg";
import send from "../../../assets/svg/send.svg";
import { useLoading } from "../../../providers/loadingProvider";

export interface ChatInputProps {
  onSubmit?: (value: ChatAndCommentDto) => void;
}

export const ChatInput = (props: ChatInputProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { setLoading } = useLoading();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const cursorPositionRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (payload: FormData) => uploadImage(payload),
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("click");
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

  const onPrepareFile = (): Promise<string[]> => {
    if (files.length === 0) return Promise.resolve([]);
    return Promise.all(
      Array.from(files).map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        return uploadMutation
          .mutateAsync(formData)
          .then((data) => data.imageUrl);
      }),
    );
  };

  const sendMessage = async () => {
    if (!message.trim() && files.length === 0) return;
    const uploadedUrls = await onPrepareFile();
    const resolvedPreviews = uploadedUrls.length > 0 ? uploadedUrls : previews;
    const payload: ChatAndCommentDto = {
      content: message,
      metaData: resolvedPreviews.map((url, index) => ({
        id: index,
        url,
      })),
    };

    props?.onSubmit?.(payload);

    setMessage("");
    setFiles([]);
    setPreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
  };
  return (
    <div className="chat__input">
      <div className="chat__input-col-1">
        <label htmlFor="upload" className="btn-upload">
          <input
            id="upload"
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleUploadImage}
          />
        </label>
      </div>
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
                <img
                  className="image_container-action"
                  src={remove}
                  onClick={() => removeImage(index)}
                />
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
          onSelect={(e) => {
            cursorPositionRef.current = e.currentTarget.selectionStart;
          }}
          onClick={(e) => {
            cursorPositionRef.current = e.currentTarget.selectionStart;
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
          <div
            ref={emojiPickerRef}
            style={{
              position: "absolute",
              bottom: "100%",
              right: 0,
              marginBottom: "8px",
              zIndex: 1000,
            }}
          >
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
