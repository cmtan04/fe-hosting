import { Button, Col, Form, Row, type FormInstance } from "antd";
import { FormInput } from "@components/FormInput/formInput";
import { FormDatePicker } from "@components/FormDatePicker/formDatePicker";
import { FormTextArea } from "@components/FormTextArea/formTextArea";
import { DATE_FORMAT } from "@common/constants/constants";
import dayjs from "dayjs";
import icnClear from "@/assets/svg/icn-clear.svg";
import "./style.scss";

interface ProfileFormProps {
  form: FormInstance;
  onFinish: () => void;
  onOpenAddressModal: () => void;
  onCancel: () => void;
}

export const ProfileForm = ({
  form,
  onFinish,
  onOpenAddressModal,
  onCancel,
}: ProfileFormProps) => {
  return (
    <Col className="profile__information-form">
      <div className="header">
        <h2 style={{ marginTop: "0px" }}>Chỉnh sửa thông tin cá nhân</h2>
        <button
          className="header-close"
          onClick={onCancel}
          type="button"
          aria-label="Close"
        >
          <img src={icnClear} alt="" />
        </button>
      </div>
      <Form form={form} onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <FormInput
              label="Tên người dùng"
              name="username"
              placeholder="Nhập tên người dùng"
              vertical={true}
              formItemProps={{
                rules: [
                  { required: true, message: "Trường này là trường bắt buộc." },
                ],
              }}
            />
          </Col>
          <Col span={16}>
            <FormInput
              label="Tên đầy đủ"
              name="fullName"
              placeholder="Nhập tên đầy đủ"
              vertical={true}
              formItemProps={{
                rules: [
                  { required: true, message: "Trường này là trường bắt buộc." },
                ],
              }}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={8}>
            <FormInput
              label="Số điện thoại"
              name="phone"
              placeholder="Nhập số điện thoại"
              vertical={true}
              formItemProps={{
                rules: [
                  { required: true, message: "Trường này là trường bắt buộc." },
                ],
              }}
            />
          </Col>
          <Col span={8}>
            <FormInput
              label="Địa chỉ email"
              name="email"
              placeholder="Nhập địa chỉ email"
              disabled
              vertical={true}
              formItemProps={{
                rules: [
                  { required: true, message: "Trường này là trường bắt buộc." },
                ],
              }}
            />
          </Col>
          <Col span={8} className="time-wrapper">
            <FormDatePicker
              label="Ngày sinh"
              name="dateOfBirth"
              vertical={true}
              formItemProps={{
                rules: [{ required: true, message: "Vui lòng chọn ngày sinh" }],
              }}
              datePickerProps={{
                format: DATE_FORMAT,
                placeholder: "Chọn ngày sinh",
                disabledDate: (current) => current.isAfter(dayjs()),
              }}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <FormTextArea
              label="Bio"
              name="bio"
              placeholder="Nhập bio"
              vertical={true}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="address">
          <Col span={20}>
            <FormTextArea
              label="Địa chỉ"
              name="fullAddress"
              disabled
              placeholder="Nhập địa chỉ"
              vertical={true}
            />
          </Col>
          <Col span={4}>
            <Button
              htmlType="button"
              className="button-submit"
              onClick={onOpenAddressModal}
            >
              Chọn địa chỉ
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="action">
          <Button htmlType="submit" className="button-submit">
            Lưu
          </Button>
        </Row>
      </Form>
    </Col>
  );
};
