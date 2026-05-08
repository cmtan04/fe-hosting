import { Checkbox, Col, DatePicker, Form, Row } from "antd";
import { DATE_FORMAT } from "@common/constants/constants";
import { NUMBER_REGEX } from "@common/constants/regexs";
import { FormInput } from "@components/FormInput/formInput";
import { FormTextArea } from "@components/FormTextArea/formTextArea";
import { FormNumber } from "@components/FormInputNumber/formInputNumer";
import { SelectCommon } from "@components/SelectCommon";

/**
 * Thành phần con chứa các trường thông tin cốt lõi của Bước 1.
 * Xử lý các đầu vào cho tên, diện tích, giá, mô tả và
 * logic hiển thị có điều kiện cho các trường giới hạn thời gian.
 */
export const BasicInfoFields = () => {
  return (
    <div className="renter-sectionBand">
      <div className="renter-sectionBand-header">
        <h2>Thông tin cơ bản</h2>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <FormInput
            label="Tên không gian"
            name="locationName"
            placeholder="Nhập tên không gian"
            vertical={true}
            formItemProps={{
              rules: [
                {
                  required: true,
                  message: "Trường này là trường bắt buộc",
                },
              ],
            }}
          />
        </Col>
        <Col span={12}>
          <FormInput
            label="Diện tích (m2)"
            name="area"
            placeholder="Nhập diện tích"
            vertical={true}
            formItemProps={{
              rules: [
                {
                  pattern: NUMBER_REGEX,
                  message: "Vui lòng nhập đúng số",
                },
              ],
            }}
          />
        </Col>

        <Col span={24}>
          <div
            style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
          >
            <div style={{ flex: 2 }}>
              <FormNumber
                label="Giá cho thuê (VNĐ)"
                name="price"
                placeholder="Nhập giá cho thuê"
                vertical={true}
                min={0}
                formatter={(value: any) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value: any) => value!.replace(/\./g, "")}
                formItemProps={{
                  rules: [
                    {
                      required: true,
                      message: "Trường này là trường bắt buộc",
                    },
                  ],
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <SelectCommon
                label="Đơn vị tính"
                name="priceUnit"
                placeholder="Chọn đơn vị"
                options={[
                  { key: 1, label: "tháng", value: "tháng" },
                  { key: 2, label: "ngày", value: "ngày" },
                  { key: 3, label: "giờ", value: "giờ" },
                  { key: 4, label: "năm", value: "năm" },
                ]}
                formItemProps={{
                  rules: [
                    {
                      required: true,
                      message: "Trường này là trường bắt buộc",
                    },
                  ],
                }}
              />
            </div>
          </div>
        </Col>
      </Row>
      <FormTextArea
        label="Mô tả không gian"
        name="description"
        placeholder="Nhập mô tả chi tiết về không gian của bạn (ví dụ: Ưu điểm, Quy định, ...)"
        vertical={true}
      />
      {/* <Form.Item name="hasTimeLimit" valuePropName="checked">
        <Checkbox>Giới hạn thời gian cho thuê</Checkbox>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prev, next) =>
          prev.hasTimeLimit !== next.hasTimeLimit
        }
      >
        {({ getFieldValue }) =>
          getFieldValue("hasTimeLimit") ? (
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="availableFrom"
                  label="Từ ngày"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày bắt đầu.",
                    },
                  ]}
                >
                  <DatePicker
                    format={DATE_FORMAT}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="availableTo"
                  label="Đến ngày"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày kết thúc.",
                    },
                  ]}
                >
                  <DatePicker
                    format={DATE_FORMAT}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : null
        }
      </Form.Item> */}
    </div>
  );
};
