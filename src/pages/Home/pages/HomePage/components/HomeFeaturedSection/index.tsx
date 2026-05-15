import { Button, Col, Row } from "antd";
import type { LocationDto } from "@api/dtos/location.dto";
import { LocationCard } from "@/pages/Location/components/LocationCard";
import { isFavoriteLocation } from "@common/utils/favoriteLocations";
import { supportSteps } from "../../utils/homePage.constants";
import { getHomePageFallbackImage } from "../../utils/homePage.utils";
import Lottie from "lottie-react";

interface HomeFeaturedSectionProps {
  title: string;
  description: string;
  ctaLabel: string;
  isLoading: boolean;
  isError: boolean;
  locations: LocationDto[];
  onOpenAll: () => void;
  onLocationClick: (code: string) => void;
  renderType: string;
}

export const HomeFeaturedSection = ({
  title,
  description,
  ctaLabel,
  isLoading,
  isError,
  locations,
  renderType,
  onOpenAll,
  onLocationClick,
}: HomeFeaturedSectionProps) => {
  let content;

  if (isLoading) {
    content = (
      <Row gutter={[16, 16]}>
        {Array.from({ length: 6 }, (_, slot) => (
          <Col xs={24} sm={12} lg={8} key={`skeleton-${slot + 1}`}>
            <div className="home_page__skeleton" />
          </Col>
        ))}
      </Row>
    );
  } else if (isError) {
    content = (
      <div className="home_page__empty-state">
        <p>Không tải được danh sách phòng ở mục này.</p>
        <Button onClick={onOpenAll}>Mở trang danh sách</Button>
      </div>
    );
  } else if (locations.length === 0) {
    content = (
      <div className="home_page__empty-state">
        <p>Chưa có phòng phù hợp cho mục này.</p>
        <Button onClick={onOpenAll}>Xem tất cả phòng</Button>
      </div>
    );
  } else {
    content = (
      <Row gutter={[16, 16]} className="home_page__featured-grid">
        {locations.map((location) => (
          <Col xs={24} sm={12} lg={6} key={location.locationCode}>
            <LocationCard
              code={location.locationCode}
              typeName={location.typeName}
              name={location.locationName}
              description={location.locationDescription}
              address={location.address?.[0]?.fullAddress}
              rate={location.locationRate}
              price={location.locationPrice || location.locationPriceAfterDeal}
              priceUnit={location.locationPriceUnit}
              image={
                location.locationLogo || getHomePageFallbackImage("listing")
              }
              isFavourite={isFavoriteLocation(location.locationCode)}
              onClick={onLocationClick}
            />
          </Col>
        ))}
      </Row>
    );
  }
  const renderSupport = () => {
    return (
      <section className="home_page__section home_page__section--featured">
        <div className="row__content">
          <h1 className="row__content-title">Hỗ trợ & Đồng hành cùng bạn</h1>
        </div>
        <div className="row__action">
          <div className="row__action-left">
            <p className="row__content-description">
              Đội ngũ hỗ trợ luôn sẵn sàng giải đáp thắc mắc và hỗ trợ bạn trong
              suốt quá trình sử dụng.
            </p>
          </div>
        </div>
        <Row gutter={[16, 16]} justify={"center"} className="row__description">
          {supportSteps.map((step) => (
            <Col xs={24} md={12} lg={6} key={step.id}>
              <div className="row__description-item">
                <Lottie className="lottie-icon" animationData={step.icon} />
                <div className="div">
                  <h3 className="row__description-title">{step.title}</h3>
                  <p className="row__description-description">
                    {step.description}
                  </p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </section>
    );
  };

  return (
    <>
      <section className="home_page__section home_page__section--featured">
        <div className="home_page__section-header">

            <h2 className="home_page__section-title">{title}</h2>
            <Button type="primary" ghost onClick={onOpenAll}>
              {ctaLabel}
            </Button>

        </div>
        <p className="home_page__section-description">{description}</p>

        {content}
      </section>
      {renderType === "map" && renderSupport()}
    </>
  );
};
