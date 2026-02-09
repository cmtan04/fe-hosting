import { Col, Form, Row } from "antd";
import { FormInput } from "../../../../components/FormInput/formInput";
import { SelectCommon } from "../../../../components/SelectCommon";
import type { SelectOptionProps } from "../../../../common/types/common";

export const ProfileLocation = () => {
  const [form] = Form.useForm();

  const onSubmitSearch = () => {};

  const rentOption: SelectOptionProps[] = [
    {
      key: 0,
      value: 0,
      label: "Chưa thuê",
    },
    {
      key: 1,
      value: 1,
      label: "Đã thuê",
    },
  ];
  return (
    <div className="profile__location">
      <div className="profile__location-header">
        <h1>Danh sách địa điểm của bạn</h1>
        <p>Danh sách các địa điểm mà bạn đã cung cấp.</p>
      </div>
      <div className="profile__location-body">
        <div className="profile__location-body-search">
          <Form form={form} onFinish={onSubmitSearch}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <FormInput
                  label="Tên địa chỉ"
                  name="phone"
                  placeholder="Nhập tên địa chỉ"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  }}
                />
              </Col>
              <Col span={8}>
                <SelectCommon
                  label="Trạng thái"
                  name="phone"
                  placeholder="Trạng thái"
                  options={rentOption}
                  formItemProps={{
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  }}
                />
              </Col>
              <Col span={8}>
                <FormInput
                  label="Phân loại"
                  name="phone"
                  placeholder="Phân loại"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};
