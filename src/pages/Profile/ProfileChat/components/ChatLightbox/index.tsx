import { Button, Image, Modal, Typography } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import type { ChatImagePreviewItem } from "../../types";
import "./style.scss";

interface ChatLightboxProps {
  currentImage?: ChatImagePreviewItem;
  imageCount: number;
  imageIndex: number;
  open: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ChatLightbox = ({
  currentImage,
  imageCount,
  imageIndex,
  open,
  onClose,
  onNext,
  onPrev,
}: ChatLightboxProps) => (
  <Modal
    className="chat-lightbox"
    open={open}
    footer={null}
    centered
    width="min(1120px, 96vw)"
    onCancel={onClose}
    destroyOnClose
  >
    <div className="chat-lightbox__stage">
      {imageCount > 1 && (
        <Button
          className="chat-lightbox__nav chat-lightbox__nav--prev"
          shape="circle"
          icon={<LeftOutlined />}
          onClick={onPrev}
          aria-label="Ảnh trước"
        />
      )}

      {currentImage && (
        <Image
          src={currentImage.url}
          alt={currentImage.fileName || `image-${imageIndex + 1}`}
          preview={false}
        />
      )}

      {imageCount > 1 && (
        <Button
          className="chat-lightbox__nav chat-lightbox__nav--next"
          shape="circle"
          icon={<RightOutlined />}
          onClick={onNext}
          aria-label="Ảnh tiếp theo"
        />
      )}
    </div>

    <div className="chat-lightbox__meta">
      <span>
        {imageIndex + 1}/{imageCount}
      </span>
      <Typography.Text ellipsis>
        {currentImage?.fileName || `Ảnh ${imageIndex + 1}`}
      </Typography.Text>
    </div>
  </Modal>
);
