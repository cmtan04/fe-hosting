import type { LocationTypeDto } from "@api/dtos/location.dto";
import { LocationTypeCard } from "@/pages/Renter/components/LocationTypeCard";
import { Col, Form, Row } from "antd";
interface LocationTypeSelectorProps {
  typeList?: LocationTypeDto[];
  selectedTypeCode?: string;
  onSelect: (typeCode: string) => void;
}

/**
 * Thành phần con để chọn loại không gian (ví dụ: Văn phòng, Studio, v.v.).
 * Hiển thị một danh sách các thẻ và làm nổi bật thẻ đã được chọn.
 */
export const LocationTypeSelector = ({
  typeList,
  selectedTypeCode,
  onSelect,
}: LocationTypeSelectorProps) => {
  return (
    <Form.Item name="typeCode" className="renter-sectionBand">
      <div className="renter-sectionBand-header">
        <h2>Loại không gian</h2>
      </div>
      <Row gutter={[8,8]} className="renter_location-type-body renter_location-type-body--compact">
        {typeList?.map((item: LocationTypeDto) => (
          <Col
            span={12}
            key={item.typeCode}
            className={`item ${selectedTypeCode === item.typeCode ? "active" : ""}`}
            onClick={() => onSelect(item.typeCode)}
            >
              <LocationTypeCard
                typeName={item.typeName}
                typeDescription={item.typeDescription}
                typeBackGround={item.typeBackGround}
                typeLogo={item.typeLogo}
              />
            </Col>
        ))}
      </Row>
    </Form.Item>
  );
};
