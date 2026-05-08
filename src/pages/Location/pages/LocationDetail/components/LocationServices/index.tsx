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
      <Col span={12}>
        <p className="wrap-label">Tiện ích & Dịch vụ</p>
        <p className="wrap-title">Những gì bạn sẽ nhận được</p>
        <div className="wrap-content-service">
          {locationDetail?.services?.map((service) => (
            <div
              key={service.serviceCode}
              className="location-serviceRow"
            >
              <div className="location-serviceRow__tag">
                <ServiceTag
                  icon={<CheckOutlined style={{ color: "green" }} />}
                  name={service.serviceName}
                  price={String(service.servicePrice)}
                  description={service.serviceDescription ?? ""}
                  active={true}
                  isFree={service.isFree}
                  unit={resolveServiceUnit(service.unit)}
                />
              </div>

              {service.serviceDescription && (
                <div className="renter-selectedServiceDescription">
                  {service.serviceDescription}
                </div>
              )}
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );
};
