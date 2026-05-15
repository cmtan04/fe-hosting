import { Col, Row } from "antd";
import type { LocationDto } from "@api/dtos/location.dto";
import { LocationCard } from "@/pages/Location/components/LocationCard";
import { isFavoriteLocation } from "@common/utils/favoriteLocations";
import "./style.scss";

interface RelatedLocationsProps {
  relatedLocations: LocationDto[];
  loading: boolean;
  error: boolean;
  onCardClick: (code: string) => void;
}

export const RelatedLocations = ({
  relatedLocations,
  loading,
  error,
  onCardClick,
}: RelatedLocationsProps) => {
  return (
    <Row gutter={[16, 16]} className="related-locations">
      <Col span={24}>
        <h1 className="title">Các địa điểm khác</h1>
        <Row gutter={[12, 12]} className="list">
          {loading ? (
            <p className="related-state">Đang tải các địa điểm khác...</p>
          ) : null}
          {!loading && error ? (
            <p className="related-state">
              Không tải được các địa điểm liên quan.
            </p>
          ) : null}
          {!loading && !error && relatedLocations.length === 0 ? (
            <p className="related-state">
              Chưa có địa điểm liên quan để hiển thị.
            </p>
          ) : null}
          {!loading && !error
            ? relatedLocations.map((relatedLocation: LocationDto) => (
                <LocationCard
                  key={relatedLocation.locationCode}
                  code={relatedLocation.locationCode}
                  typeName={relatedLocation.typeName}
                  name={relatedLocation.locationName}
                  description={relatedLocation.locationDescription}
                  address={relatedLocation.address?.[0]?.fullAddress}
                  rate={relatedLocation.locationRate}
                  price={
                    relatedLocation.locationPrice ||
                    relatedLocation.locationPriceAfterDeal
                  }
                  priceUnit={relatedLocation.locationPriceUnit}
                  image={relatedLocation.locationLogo || ""}
                  isFavourite={isFavoriteLocation(relatedLocation.locationCode)}
                  onClick={onCardClick}
                />
              ))
            : null}
        </Row>
      </Col>
    </Row>
  );
};
