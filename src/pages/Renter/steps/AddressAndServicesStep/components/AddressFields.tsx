import { Col, Row } from "antd";
import { FormInput } from "@components/FormInput/formInput";
import { FormTextArea } from "@components/FormTextArea/formTextArea";

export const AddressFields = () => {
  return (
    <div className="renter-sectionBand">
      <div className="renter-sectionBand-header">
        <h2>Thông tin địa chỉ</h2>
        <p>
          Chọn vị trí trên bản đồ để tự động điền địa chỉ đầy đủ và các trường
          địa lý liên quan. Sau đó, bổ sung thông tin chi tiết và mô tả để khách
          dễ dàng tìm thấy bạn hơn nhé.
        </p>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <FormTextArea
            label="Thông tin chi tiết"
            name="addressDetail"
            placeholder="Ví dụ: Số nhà, tòa, tầng, căn hộ"
            vertical={true}
          />
        </Col>
        <Col span={24}>
          <FormTextArea
            label="Địa chỉ đầy đủ"
            name="fullAddress"
            placeholder="Được tạo tự động từ bản đồ"
            vertical={true}
            readOnly={true}
            disabled={true}
            formItemProps={{
              rules: [
                {
                  required: true,
                  message: "Hãy chọn vị trí trên map.",
                },
              ],
            }}
          />
        </Col>
        <Col span={12}>
          <FormInput
            label="Phường / Xã "
            name="ward"
            vertical={true}
            readOnly={true}
            disabled={true}
          />
        </Col>
        <Col span={12}>
          <FormInput
            label="Tỉnh / Thành phố"
            name="city"
            vertical={true}
            readOnly={true}
            disabled={true}
            formItemProps={{
              rules: [
                {
                  required: true,
                  message: "Hãy chọn vị trí trên map.",
                },
              ],
            }}
          />
        </Col>
        <Col span={12}>
          <FormInput
            label="Quốc gia"
            name="country"
            vertical={true}
            readOnly={true}
            disabled={true}
          />
        </Col>
        <Col span={12}>
          <FormInput
            label="Khu vực"
            name="region"
            vertical={true}
            readOnly={true}
            disabled={true}
          />
        </Col>
        <Col span={24}>
          <FormTextArea
            label="Chỉ dẫn đường đi"
            name="description"
            placeholder="Ví dụ: Nhà trong ngõ cạnh hiệu thuốc, đi đến cuối đường rẽ trái..."
            vertical={true}
          />
        </Col>
      </Row>
    </div>
  );
};
