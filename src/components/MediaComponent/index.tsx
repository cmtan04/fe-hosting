import { useState } from "react";
import { PlayCircleFilled } from "@ant-design/icons";
import "./style.scss";
import Lightbox from "yet-another-react-lightbox";
// 1. Import Plugin logic (từ thư mục plugins)
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css"; // CSS tổng
import "yet-another-react-lightbox/plugins/thumbnails.css"; // CSS riêng cho thumbnail
import { Flex } from "antd";

interface MediaItem {
  url: string;
  type: "image" | "video";
  thumbnail?: string;
}

interface MediaGalleryProps {
  media: MediaItem[];
}

export const MediaGallery = ({ media }: MediaGalleryProps) => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media || media.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "80% !important",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Chưa có ảnh/video{" "}
      </div>
    );
  }

  const handleOpenPreview = (index: number) => {
    setCurrentIndex(index);
    setVisible(true);
  };

  const getThumbSrc = (item: MediaItem) => {
    if (item.type === "video") {
      return item.url.replace(".mp4", ".jpg");
    }
    return item.url;
  };

  const renderGrid = () => {
    const count = media.length;

    return (
      <div
        className="media-grid media-grid--single"
        onClick={() => handleOpenPreview(0)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleOpenPreview(0);
          }
        }}
      >
        <div className="media-grid__item main">
          <img src={getThumbSrc(media[0])} alt="" />
          {media[0].type === "video" && (
            <PlayCircleFilled className="video-icon" />
          )}
          {count > 1 && (
            <div className="media-grid__overlay">
              <span>+{count - 1}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="media-gallery-container">
      {renderGrid()}

      <Lightbox
        open={visible}
        close={() => setVisible(false)}
        index={currentIndex}
        slides={media.map((item) =>
          item.type === "video"
            ? {
                type: "video" as const,
                sources: [{ src: item.url, type: "video/mp4" }],
                poster: getThumbSrc(item),
              }
            : { src: item.url },
        )}
        plugins={[Video, Zoom, Thumbnails]}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          gap: 16,
          border: 0,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
        }}
        video={{
          autoPlay: true,
          controls: true,
        }}
        on={{
          view: ({ index }) => setCurrentIndex(index),
        }}
        carousel={{
          finite: false,
        }}
      />
    </div>
  );
};
