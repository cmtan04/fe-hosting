import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Checkbox, Row, Select, Col } from "antd";
import type {
  LocationServiceSelectionDto,
  ServiceDto,
} from "@api/dtos/location.dto";
import { ServiceTag } from "@pages/Renter/components/ServiceTag";
import {
  getServiceSelectionPrice,
  resolveServiceName,
  normalizeQuantity,
  resolveServiceUnit,
} from "../utils/service.utils";
import "./styles.scss";

interface ServiceListProps {
  selectedServices: LocationServiceSelectionDto[];
  catalogServices?: ServiceDto[];
  onRemove: (index: number) => void;
}

/**
 * Component hiển thị danh sách các dịch vụ đã được người dùng chọn
 * Cho phép chỉnh sửa nhanh các thuộc tính như giá, đơn vị, số lượng và xóa dịch vụ
 */
export const ServiceList = ({
  selectedServices,
  catalogServices,
  onRemove,
}: ServiceListProps) => {
  return (
    <div className="renter-selectedServices">
      {selectedServices.map((service, index) => {
        // Tìm thông tin gốc từ danh mục (nếu có) để lấy mô tả hoặc giá mặc định
        const catalogService = catalogServices?.find(
          (s) => s.serviceCode === service.serviceCode,
        );

        const serviceName = resolveServiceName(service, catalogService);
        const serviceDescription =
          service.description || catalogService?.serviceDescription;
        const servicePrice = getServiceSelectionPrice(service, catalogService);

        return (
          <div
            key={`${service.serviceCode ?? service.name}-${index}`}
            className="renter-selectedServiceRow"
          >
            {/* Hiển thị thẻ dịch vụ với các thông tin cơ bản */}
            <Row className="renter-selectedServiceRow__tag" align="middle">
              <Col flex="auto">
                <ServiceTag
                  icon={<CheckOutlined style={{ color: "green" }} />}
                  name={serviceName}
                  price={String(servicePrice)}
                  description={serviceDescription ?? ""}
                  active={true}
                  isFree={service.isFree}
                  unit={resolveServiceUnit(service.unit)}
                />
              </Col>
              <Col flex="32px">
                {/* Nút xóa dịch vụ khỏi danh sách chọn */}
                <div className="renter-selectedServiceActions">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onRemove(index)}
                    aria-label={`Xóa ${serviceName}`}
                  />
                </div>
              </Col>
            </Row>

            {serviceDescription && (
              <div className="renter-selectedServiceDescription">
                {serviceDescription}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
