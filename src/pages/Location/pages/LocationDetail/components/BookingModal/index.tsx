import { Modal, Form, Input, DatePicker, Typography, Space, Divider } from "antd";
import type { LocationDto } from "@/api/dtos/location.dto";
import { formatMoney } from "@/common/contexts/format";
import { CreditCardOutlined, InfoCircleOutlined } from "@ant-design/icons";
import "./style.scss";

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationDetail?: LocationDto;
  onSubmitBooking: (checkInDate?: string, checkOutDate?: string, note?: string) => void;
}

export const BookingModal = ({
  isOpen,
  onClose,
  locationDetail,
  onSubmitBooking,
}: BookingModalProps) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    let checkInDate = undefined;
    let checkOutDate = undefined;

    if (values.dates?.length === 2) {
      checkInDate = values.dates[0].format("YYYY-MM-DD");
      checkOutDate = values.dates[1].format("YYYY-MM-DD");
    }

    onSubmitBooking(checkInDate, checkOutDate, values.note);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const price = locationDetail?.locationPrice || locationDetail?.locationPriceAfterDeal || 0;
  const cancellationFeePercent = locationDetail?.cancellationFeePercent || 0;
  const rescheduleFeePercent = locationDetail?.rescheduleFeePercent || 0;

  return (
    <Modal
      title={<Title level={4}>Xác nhận đặt phòng</Title>}
      open={isOpen}
      onCancel={handleCancel}
      className="booking-modal"
      width={600}
      okText="Thanh toán bằng thẻ"
      cancelText="Hủy bỏ"
      onOk={() => form.submit()}
      okButtonProps={{ icon: <CreditCardOutlined />, size: "large", className: "btn-pay" }}
      cancelButtonProps={{ size: "large", className: "btn-cancel" }}
    >
      <div className="booking-modal__content">
        <div className="location-info">
          {locationDetail?.media?.[0]?.url && (
            <img src={locationDetail.media[0].url} alt="location" className="location-info__image" />
          )}
          <div className="location-info__details">
            <Text strong className="location-info__name">{locationDetail?.locationName}</Text>
            <Text className="location-info__address">{locationDetail?.address?.[0]?.fullAddress}</Text>
            <Text className="location-info__price">
              {formatMoney(price)} đ / {locationDetail?.locationPriceUnit || "tháng"}
            </Text>
          </div>
        </div>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="booking-form"
        >
          <Form.Item
            name="dates"
            label="Thời gian thuê (Check-in - Check-out)"
            rules={[{ required: true, message: "Vui lòng chọn thời gian thuê!" }]}
          >
            <RangePicker style={{ width: "100%" }} size="large" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="note"
            label="Ghi chú cho chủ phòng"
          >
            <TextArea rows={3} placeholder="Ví dụ: Tôi có nuôi một chú mèo nhỏ..." />
          </Form.Item>
        </Form>

        {(cancellationFeePercent > 0 || rescheduleFeePercent > 0) && (
          <div className="fee-policy">
            <Space align="start">
              <InfoCircleOutlined className="fee-policy__icon" />
              <div>
                <Text strong>Chính sách hủy/đổi lịch:</Text>
                <ul>
                  {cancellationFeePercent > 0 && (
                    <li>Phí hủy phòng: {cancellationFeePercent}% giá trị đơn đặt</li>
                  )}
                  {rescheduleFeePercent > 0 && (
                    <li>Phí đổi lịch: {rescheduleFeePercent}% giá trị đơn đặt</li>
                  )}
                </ul>
              </div>
            </Space>
          </div>
        )}
      </div>
    </Modal>
  );
};
