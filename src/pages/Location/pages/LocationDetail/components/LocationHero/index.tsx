import { Col, Row } from "antd";
import type { LocationDto } from "@api/dtos/location.dto";
import pin from "@assets/svg/home/pin.svg";
import type { MediaItem } from "@common/config/common-config";
import { MediaGallery } from "@components/MediaComponent";
import { useShare } from "@/common/hooks/useShare";
import shareIcon from "@assets/svg/location/share.svg";
import "./style.scss";

interface LocationHeroProps {
  media: MediaItem[];
  locationDetail?: LocationDto;
}

export const LocationHero = ({ media, locationDetail }: LocationHeroProps) => {
  const { handleShare } = useShare();

  return (
    <Row gutter={[16, 16]} className="location-hero">
      <Col span={24} className="location-hero__col">
        <div className="location-hero__media">
          <MediaGallery media={media} />
          <button
            className="location-hero__share-btn"
            onClick={() =>
              handleShare(
                locationDetail?.locationCode || "",
                locationDetail?.locationName,
              )
            }
          >
            <img src={shareIcon} alt="Share" />
            <span>Chia sẻ</span>
          </button>
        </div>
        <div className="location-hero__info">
          <p className="content-label">
            <span>
              <img
                src={locationDetail?.typeLogo}
                alt={locationDetail?.typeCode}
              />
            </span>
            <span>{locationDetail?.typeName}</span>
          </p>
          <h1 className="content-name">{locationDetail?.locationName}</h1>
          <div className="location-hero__address">
            <div className="address">
              <span>
                <img src={pin} alt="Pin" />
                {locationDetail?.address?.[0]?.fullAddress}
              </span>

              <span className="note">
                {locationDetail?.address?.[0]?.addressNote}
              </span>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};
