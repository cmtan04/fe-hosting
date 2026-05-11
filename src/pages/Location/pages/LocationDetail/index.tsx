import { Col, Row } from "antd";
import { LocationAddress } from "./components/LocationAddress";
import { LocationBooking } from "./components/LocationBooking";
import { LocationHero } from "./components/LocationHero";
import { LocationOverview } from "./components/LocationOverview";
import { LocationOwner } from "./components/LocationOwner";
import { LocationReviews } from "./components/LocationReviews";
import { LocationServices } from "./components/LocationServices";
import { RelatedLocations } from "./components/RelatedLocations";
import { useLocationDetail } from "./hooks/useLocationDetail";
import "./style.scss";

export const LocationDetail = () => {
  const {
    media,
    locationDetail,
    commentData,
    refetchComment,
    relatedLocations,
    relatedLocationLoading,
    relatedLocationError,
    handleContactOwner,
    handleCardClick,
    handleShowMoreComments,
  } = useLocationDetail();

  return (
    <div className="location-detail-page">
      <LocationHero media={media} locationDetail={locationDetail} />

      <Row gutter={[16, 16]} className="location-detail-page__content">
        <Col xs={24} lg={16} className="location-detail-page__main">
          <LocationOverview locationDetail={locationDetail} />
          <LocationAddress locationDetail={locationDetail} />
          <LocationServices locationDetail={locationDetail} />
          <LocationReviews
            locationDetail={locationDetail}
            commentData={commentData}
            onRefetchComment={refetchComment}
            onShowMoreComments={handleShowMoreComments}
          />
        </Col>

        <Col xs={24} lg={8} className="location-detail-page__sidebar">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={24}>
              <LocationBooking
                locationDetail={locationDetail}
                onContactOwner={handleContactOwner}
              />
            </Col>

            <Col xs={24} sm={12} lg={24}>
              <LocationOwner
                locationDetail={locationDetail}
                onContactOwner={handleContactOwner}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <RelatedLocations
        relatedLocations={relatedLocations}
        loading={relatedLocationLoading}
        error={relatedLocationError}
        onCardClick={handleCardClick}
      />
    </div>
  );
};
