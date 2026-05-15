import { Tag } from "antd";
import type { LocationDto } from "@api/dtos/location.dto";
import {
  formatLocationPrice,
  formatLocationRating,
  getHomePageFallbackImage,
} from "../../utils/homePage.utils";

interface HomeHeroPreviewCardProps {
  location: LocationDto;
  variant?: "large" | "small";
  onClick: (code: string) => void;
}

export const HomeHeroPreviewCard = ({
  location,
  variant = "small",
  onClick,
}: HomeHeroPreviewCardProps) => {
  const price = location.locationPrice || location.locationPriceAfterDeal;

  return (
    <button
      type="button"
      className={`home_page__hero-card home_page__hero-card--${variant}`}
      onClick={() => onClick(location.locationCode)}
    >
      <div className="home_page__hero-card-media">
        <img
          src={location.locationLogo || getHomePageFallbackImage("hero")}
          alt={location.locationName}
          loading="lazy"
          decoding="async"
        />
        <Tag className="home_page__hero-card-badge">{location.typeName}</Tag>
      </div>

      <div className="home_page__hero-card-body">
        <div className="home_page__hero-card-topline">
          <span>{formatLocationPrice(price, location.locationPriceUnit)}</span>
          <span>★ {formatLocationRating(location.locationRate)}</span>
        </div>
        <h3>{location.locationName}</h3>
        <p>{location.address?.[0]?.fullAddress || "Địa chỉ đang cập nhật"}</p>
      </div>
    </button>
  );
};
