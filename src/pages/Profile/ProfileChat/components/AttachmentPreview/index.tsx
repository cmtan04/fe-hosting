import { Image, Typography } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import type { MessageAttachmentResponseDto } from "@api/dtos/chat.dto";
import type { OpenImageViewerHandler } from "../../types";
import { formatFileSize, splitAttachments } from "../../utils";
import "./style.scss";

interface AttachmentPreviewProps {
  attachments?: MessageAttachmentResponseDto[];
  onOpenImageViewer?: OpenImageViewerHandler;
}

export const AttachmentPreview = ({
  attachments,
  onOpenImageViewer,
}: AttachmentPreviewProps) => {
  const normalizedAttachments = attachments || [];
  const mediaAttachments = normalizedAttachments.filter(
    (item) =>
      item.mimeType?.startsWith("image/") || item.mimeType?.startsWith("video/"),
  );
  const imageAttachments = mediaAttachments.filter((item) =>
    item.mimeType?.startsWith("image/"),
  );
  const { fileAttachments } = splitAttachments(attachments);

  if (!attachments?.length) {
    return null;
  }

  return (
    <div className="chat-attachment-preview">
      {mediaAttachments.length > 0 && (
        <div
          className={`chat-attachment-preview__media-grid ${
            mediaAttachments.length === 1
              ? "chat-attachment-preview__media-grid--single"
              : ""
          }`}
        >
          {mediaAttachments.map((item, index) => {
            const isImage = item.mimeType?.startsWith("image/");
            const imageIndex = isImage
              ? imageAttachments.findIndex(
                  (image) =>
                    image.url === item.url &&
                    image.fileName === item.fileName &&
                    image.mimeType === item.mimeType,
                )
              : -1;

            if (isImage) {
              return (
                <button
                  key={`${item.url}-${index}`}
                  type="button"
                  className="chat-attachment-preview__media-card"
                  onClick={() =>
                    onOpenImageViewer?.(
                      imageAttachments,
                      imageIndex >= 0 ? imageIndex : 0,
                    )
                  }
                >
                  <Image
                    src={item.url}
                    alt={item.fileName || `image-${index + 1}`}
                    preview={false}
                  />
                </button>
              );
            }

            return (
              <div
                key={`${item.url}-${index}`}
                className="chat-attachment-preview__media-card chat-attachment-preview__media-card--video"
              >
                <video controls preload="metadata">
                  <source src={item.url} type={item.mimeType || "video/mp4"} />
                </video>
                <div className="chat-attachment-preview__media-play">
                  <PlayCircleOutlined />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {fileAttachments.length > 0 && (
        <div className="chat-attachment-preview__files">
          {fileAttachments.map((item, index) => (
            <a
              key={`${item.url}-${index}`}
              className="chat-attachment-preview__file"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chat-attachment-preview__file-meta">
                <Typography.Text ellipsis>
                  {item.fileName || "Tep dinh kem"}
                </Typography.Text>
                <span>{formatFileSize(item.size)}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
