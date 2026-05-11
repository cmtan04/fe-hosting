import { Col, Rate, Row } from "antd";
import type { LocationDto } from "@api/dtos/location.dto";
import "./style.scss";

interface LocationOverviewProps {
  locationDetail?: LocationDto;
}

export const LocationOverview = ({ locationDetail }: LocationOverviewProps) => {
  return (
    <Row gutter={[16, 16]} className="location-overview__description">
      <Col span={24}>
        <h3 className="wrap-label">Giới thiệu</h3>
        <h4 className="wrap-title">Về không gian này</h4>
        <p className="wrap-content">{locationDetail?.locationDescription}</p>
      </Col>
    </Row>
  );
};
