import { Col, Rate, Row } from "antd";
import type { LocationDto } from "@/api/dtos/location.dto";
import { LocationComment } from "@/pages/Location/components/LocationComment";
import "./style.scss";

interface LocationReviewsProps {
  locationDetail?: LocationDto;
  commentData?: any;
  onRefetchComment: () => void;
  onShowMoreComments: (nextPage: number) => void;
}

export const LocationReviews = ({
  locationDetail,
  commentData,
  onRefetchComment,
  onShowMoreComments,
}: LocationReviewsProps) => {
  return (
    <Row gutter={[16, 16]} className="location-reviews">
      <Col span={24}>
        <p className="row-3-label">Đánh giá</p>
        <p className="row-3-note">
          {locationDetail && locationDetail.locationRate > 0 ? (
            <Rate disabled defaultValue={locationDetail.locationRate} />
          ) : (
            <span>Chưa có đánh giá nào</span>
          )}
        </p>
        <div className="row-3-content">
          <p className="row-3-title">Bình luận</p>
          <LocationComment
            locationCode={locationDetail?.locationCode}
            data={commentData}
            onRefetch={onRefetchComment}
            onShowMore={onShowMoreComments}
          />
        </div>
      </Col>
    </Row>
  );
};
