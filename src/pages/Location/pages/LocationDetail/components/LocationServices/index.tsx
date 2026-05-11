import { Col, Row } from "antd";
import type { LocationDto } from "@api/dtos/location.dto";
import { ServiceTag } from "@/pages/Renter/components/ServiceTag";
import "./style.scss";
import { CheckOutlined } from "@ant-design/icons";
import { resolveServiceUnit } from "@pages/Renter/steps/AddressAndServicesStep/utils/service.utils";

interface LocationServicesProps {
  locationDetail?: LocationDto;
}

export const LocationServices = ({ locationDetail }: LocationServicesProps) => {
  return (
    <Row gutter={[16, 16]} className="location-services">
      <Col span={24}>
        <p className="wrap-label">Tiện ích & Dịch vụ</p>
        <p className="wrap-title">Những gì bạn sẽ nhận được</p>
        <Row gutter={[16, 16]}>
          {locationDetail?.services?.map((service) => (
            <Col span={12} key={service.serviceCode}>
              <ServiceTag
                icon={<CheckOutlined style={{ color: "green" }} />}
                name={service.serviceName}
                price={String(service.basePrice)}
                description={service.description ?? ""}
                active={true}
                isFree={service.isFree}
                unit={resolveServiceUnit(service.unit)}
              />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};
