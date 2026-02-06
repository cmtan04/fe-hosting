import { Button, Checkbox, Col, DatePicker, Form, Row } from "antd";
import { FormInput } from "../../../components/FormInput/formInput";
import { FormTextArea } from "../../../components/FormTextArea/formTextArea";
import type { RenterProps } from "../RenterLayout";
import { DATE_FORMAT } from "../../../common/constants/constants";
import dayjs from "dayjs";

export const FillInformation = (props: RenterProps) => {
  const [form] = Form.useForm();

  const onSubmit = () => {
    const payload = {
      locationName: form.getFieldValue("locationName"),
      minTimeLimit: dayjs(form.getFieldValue("minTimeLimit")).format(
        DATE_FORMAT,
      ),
      maxTimeLimit: dayjs(form.getFieldValue("maxTimeLimit")).format(
        DATE_FORMAT,
      ),
      locationDescription: form.getFieldValue("locationDescription"),
      locationNote: form.getFieldValue("locationNote"),
    };

    props.onSubmit(payload);
  };
  return (
    <div className="renter__fillInformation">
      <div className="renter__fillInformation-header">
        <h1 className="header-title">Thông tin về không gian của bạn</h1>
        <p className="header-subTitle">
          Vui lòng cung cấp thông tin về không gian mà bạn cung cấp. Điều này
          giúp mọi người tìm kiếm không gian của bạn dễ dàng hơn.
        </p>
      </div>
      <div className="renter__fillInformation-body">
        <Form
          form={form}
          onFinish={onSubmit}
          className="renter__fillInformation-form"
        >
          <FormInput
            label="Tên địa điểm"
            name="locationName"
            placeholder="Nhập tên địa điểm"
            vertical={true}
            formItemProps={{
              rules: [
                { required: true, message: "Trường này là trường bắt buộc." },
              ],
            }}
          />

          <FormTextArea
            label="Mô tả"
            name="locationDescription"
            placeholder="Nhập mô tả"
            vertical={true}
            formItemProps={{
              rules: [
                { required: false, message: "Trường này là trường bắt buộc." },
              ],
            }}
          />

          <FormTextArea
            label="Ghi chú"
            name="locationNote"
            placeholder="Nhập ghi chú"
            vertical={true}
            formItemProps={{
              rules: [
                { required: false, message: "Trường này là trường bắt buộc." },
              ],
            }}
          />

          <Form.Item
            name="hasLimit"
            valuePropName="checked"
            className="form-checkbox"
          >
            <Checkbox>Giới hạn thời gian thuê</Checkbox>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.hasLimit !== currentValues.hasLimit
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("hasLimit") === true && (
                <Row gutter={16} className="limit-time">
                  <Col span={12}>
                    <Form.Item
                      name="minTimeLimit"
                      label="Từ ngày"
                      vertical={true}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn ngày bắt đầu",
                        },
                      ]}
                    >
                      <DatePicker
                        format={DATE_FORMAT}
                        placeholder="Chọn ngày bắt đầu"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="maxTimeLimit"
                      vertical={true}
                      label="Đến ngày"
                      dependencies={["minTimeLimit"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn ngày kết thúc",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const minDate = getFieldValue("minTimeLimit");
                            if (!value || !minDate || value.isAfter(minDate)) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Ngày kết thúc phải sau ngày bắt đầu"),
                            );
                          },
                        }),
                      ]}
                    >
                      <DatePicker
                        format={DATE_FORMAT}
                        placeholder="Chọn ngày kết thúc"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )
            }
          </Form.Item>
          <div className="form-action">
            <Button
              htmlType="button"
              onClick={props.onCancel}
              className="button-cancel"
            >
              Hủy
            </Button>
            <Button htmlType="submit" className="button-submit">
              Tiếp theo
            </Button>
          </div>
        </Form>
      </div>
      <div className="renter__fillInformation-footer"></div>
    </div>
  );
};
