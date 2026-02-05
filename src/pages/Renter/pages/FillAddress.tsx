import { Button, Col, Form, Row } from "antd";
import type { RenterProps } from "../RenterLayout";
import "../renterLayout.scss";
import { FormInput } from "../../../components/FormInput/formInput";

export const FillAddress = (props: RenterProps) => {
  const [form] = Form.useForm();

  const onSubmit = () => {};
  return (
    <div className="renter__fillAdress">
      <div className="renter__fillAddress-header">
        <h1 className="header-title">Thông tin địa chỉ không gian của bạn</h1>
        <p className="header-subTitle">
          Vui lòng cung cấp thông tin về địa chỉ không gian mà bạn cung cấp.
          Điều này giúp mọi người tìm kiếm không gian của bạn dễ dàng hơn.
        </p>
      </div>
      <Row className="renter__fillAddress-body">
        <Col className="body__col-left" span={12}></Col>
        <Col className="body__col-right" span={12}>
          <Form
            form={form}
            onFinish={onSubmit}
            className="renter__fillAdress-form"
          >
            <Row gutter={[16, 16]} className="form-row">
              <Col span={6}>
                <FormInput
                  label="Tên địa chỉ"
                  name="addressName"
                  placeholder="Nhập tên địa chỉ"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Col>
              <Col span={18}>
                <FormInput
                  label="Địa chỉ chi tiết"
                  name="fullAddress"
                  placeholder="Nhập địa chỉ chi tiết"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="form-row">
              <Col span={12}>
                <FormInput
                  label="Mã bưu chính"
                  name="addRessPortal"
                  placeholder="Nhập mã bưu chính."
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Col>

              <Col span={12}>
                <FormInput
                  label="Quận / Huyện"
                  name="addressDistrict"
                  placeholder="Nhập quận / huyện"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="form-row">
              <Col span={12}>
                <FormInput
                  label="Thành phố"
                  name="addressCity"
                  placeholder="Nhập thành phố."
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Col>
              <Col span={12}>
                <FormInput
                  label="Tỉnh"
                  name="addressProvince"
                  placeholder="Nhập tỉnh"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="form-row">
              <Col span={12}>
                <FormInput
                  label="Phường / Xã"
                  name="addressWard"
                  placeholder="Nhập phường / xã."
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Col>
              <Col span={12}>
                <FormInput
                  label="Quốc gia"
                  name="addressCountry"
                  placeholder="Nhập quốc giá"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Col>
            </Row>

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
        </Col>
      </Row>
    </div>
  );
};
