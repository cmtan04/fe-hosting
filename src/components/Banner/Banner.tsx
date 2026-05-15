import { Button } from "antd";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { FormSearch } from "../FormSearch/formSearch";
import { ROUTER_PATH } from "../../router/Route";
import "./Banner.scss";

interface BannerProps {
  readonly image?: string;
  readonly title?: string;
  readonly description?: string;
  readonly onSearch?: (value: string) => void;
}

const DEFAULT_TITLE = "Tìm kiếm không gian phù hợp";
const DEFAULT_DESCRIPTION =
  "Khám phá địa điểm theo khu vực, loại hình và nhu cầu của bạn.";

const DEFAULT_SEARCH_SUGGESTIONS = [
  "Hà Nội",
  "Phú Quốc",
  "Hội An",
  "Quận Đống Đa",
  "Đường Giải Phóng",
];

const REGION_SUGGESTIONS: Record<string, string[]> = {
  north: ["Hà Nội", "Hải Phòng", "Quảng Ninh", "Mù Cang Chải", "Tà Xùa"],
  central: ["Đà Nẵng", "Hội An", "Huế", "Quảng Bình", "Sầm Sơn"],
  south: ["Hồ Chí Minh", "Phú Quốc", "Cần Thơ", "Vũng Tàu", "Đà Lạt"],
};

export const Banner = ({
  image,
  title,
  description,
  onSearch,
}: BannerProps) => {
  const location = useLocation();
  const imgSrc = image || "/assets/banner-default.jpg";

  const suggestions = useMemo(() => {
    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const scopedRegion = searchParams.get("region");

    if (pathname.startsWith(ROUTER_PATH.LOCATIONS)) {
      if (scopedRegion) {
        return REGION_SUGGESTIONS[scopedRegion] || [];
      }
    }
    return DEFAULT_SEARCH_SUGGESTIONS;
  }, [location.pathname, location.search]);

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      return;
    }

    onSearch?.(value);
  };

  return (
    <div className=" banner--has-image">
      <img className="banner__background-image" src={imgSrc} alt="" />

      <div className="banner__overlay" />
      <div className="banner__content">
        <h1 className="banner__content-title">{title ?? DEFAULT_TITLE}</h1>
        <p className="banner__content-description">
          {description ?? DEFAULT_DESCRIPTION}
        </p>
        <FormSearch
          label=""
          name="bannerSearch"
          placeholder="Tìm kiếm theo tên, địa chỉ..."
          onSearch={handleSearch}
        />

        <div className="banner__suggestions">
          <span className="banner__suggestions-label">Gợi ý:</span>
          <div className="banner__suggestions-list">
            {suggestions?.map((keyword) => (
              <Button
                key={keyword}
                className="banner__suggestions-item"
                type="text"
                onClick={() => handleSearch(keyword)}
              >
                {keyword}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
