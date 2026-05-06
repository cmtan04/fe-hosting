import { Col, Rate, Row } from "antd";
import type { LocationDto } from "@api/dtos/location.dto";
import "./style.scss";

interface LocationOverviewProps {
  locationDetail?: LocationDto;
}

export const LocationOverview = ({ locationDetail }: LocationOverviewProps) => {
  return (
    <>
      <Row gutter={[16, 16]} className="location-overview__ratings">
        <Rate defaultValue={Number(locationDetail?.locationRate)} />
        <span className="code">
          Chưa có đánh giá · Mã: <span>{locationDetail?.locationCode}</span>
        </span>
      </Row>
      <Row gutter={[16, 16]} className="location-overview__description">
        <Col span={24}>
          <p className="wrap-label">Giới thiệu</p>
          <p className="wrap-title">Về không gian này</p>
          <p className="wrap-content">
            {locationDetail?.locationDescription}
          </p>
        </Col>
      </Row>
    </>
  );
};
