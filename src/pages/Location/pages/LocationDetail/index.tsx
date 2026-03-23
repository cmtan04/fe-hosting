import { Col, Row } from "antd";
import { MediaGallery } from "../../../../components/MediaComponent";
import type { MediaItem } from "../../../../common/config/common-config";

export const LocationDetail = () => {
  const media: MediaItem[] = [
    {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60",
      type: "image",
    },
    {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60",
      type: "image",
    },
    {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60",
      type: "image",
    },
  ];

  return (
    <div className="location__detail">
      <Row gutter={[16, 16]} className="location__detail-content">
        <Col span={16} className="location__detail-content-left">
          <MediaGallery media={media} />
        </Col>
        <Col span={8} className="location__detail-content-right" />
      </Row>
    </div>
  );
};
