import { Col, Row } from "antd";
import type { LocationDto } from "@api/dtos/location.dto";
import { ServiceTag } from "@/pages/Renter/components/ServiceTag";
import "./style.scss";

interface LocationServicesProps {
  locationDetail?: LocationDto;
}

export const LocationServices = ({ locationDetail }: LocationServicesProps) => {
  return (
    <Row gutter={[16, 16]} className="location-services">
      <Col span={24}>
        <p className="wrap-label">Tiện ích & Dịch vụ</p>
        <p className="wrap-title">Những gì bạn sẽ nhận được</p>
        <div className="wrap-content-service">
          {locationDetail?.services?.map((service) => (
            <ServiceTag
              key={service.serviceCode}
              icon={service.serviceLogo}
              name={service.serviceName}
              price={service.servicePrice}
              description={service.serviceDescription}
              active={true}
            />
          ))}
        </div>
      </Col>
    </Row>
  );
};
