import { Card, Tag, Button, Empty, Space, Typography, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking } from "@/api/configs/booking.config";
import { BookingStatus, PaymentStatus, type BookingResponseDto } from "@/api/dtos/booking.dto";
import { formatMoney } from "@/common/contexts/format";
import { CalendarOutlined, EnvironmentOutlined, WalletOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./style.scss";

const { Text, Title } = Typography;
const { confirm } = Modal;

export const ProfileBooking = () => {
  const [bookings, setBookings] = useState<BookingResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings({ page: 1, limit: 100 });
      setBookings(res.data);
    } catch (error) {
      message.error("Không thể tải danh sách booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = (bookingCode: string) => {
    confirm({
      title: "Bạn có chắc chắn muốn hủy đặt phòng này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này có thể phát sinh phí hủy tùy theo quy định của chủ phòng.",
      okText: "Xác nhận hủy",
      okType: "danger",
      cancelText: "Quay lại",
      onOk: async () => {
        try {
          const res = await cancelBooking(bookingCode);
          message.success(res.message);
          fetchBookings();
        } catch (error: any) {
          message.error(error.response?.data?.message || "Không thể hủy booking");
        }
      },
    });
  };

  const getStatusTag = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return <Tag color="success">Đã xác nhận</Tag>;
      case BookingStatus.PENDING_PAYMENT:
        return <Tag color="warning">Chờ thanh toán</Tag>;
      case BookingStatus.CANCELLED:
        return <Tag color="error">Đã hủy</Tag>;
      case BookingStatus.COMPLETED:
        return <Tag color="processing">Hoàn thành</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getPaymentStatusTag = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return <Tag color="blue">Đã thanh toán</Tag>;
      case PaymentStatus.UNPAID:
        return <Tag color="default">Chưa thanh toán</Tag>;
      case PaymentStatus.REFUNDED:
        return <Tag color="purple">Đã hoàn tiền</Tag>;
      case PaymentStatus.PARTIAL_REFUND:
        return <Tag color="orange">Hoàn tiền một phần</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <div className="profile-booking">
      <Title level={3} className="page-title">Lịch sử đặt phòng của tôi</Title>
      
      {loading ? (
        <div className="loading-container">Đang tải...</div>
      ) : bookings.length === 0 ? (
        <Empty description="Bạn chưa có đơn đặt phòng nào" />
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <Card key={booking.bookingCode} className="booking-card" hoverable>
              <div className="booking-card__content">
                <div className="booking-card__image-wrapper">
                  <img src={booking.location.logo || "/placeholder-room.jpg"} alt="location" />
                </div>
                
                <div className="booking-card__info">
                  <div className="booking-card__header">
                    <Title level={4} className="location-name">{booking.location.name}</Title>
                    <Space>
                      {getStatusTag(booking.status)}
                      {getPaymentStatusTag(booking.paymentStatus)}
                    </Space>
                  </div>
                  
                  <div className="booking-card__details">
                    <div className="detail-item">
                      <EnvironmentOutlined />
                      <Text>{booking.location.fullAddress}</Text>
                    </div>
                    
                    <div className="detail-item">
                      <CalendarOutlined />
                      <Text>
                        {booking.checkInDate ? dayjs(booking.checkInDate).format("DD/MM/YYYY") : "N/A"} 
                        {" - "} 
                        {booking.checkOutDate ? dayjs(booking.checkOutDate).format("DD/MM/YYYY") : "N/A"}
                      </Text>
                    </div>
                    
                    <div className="detail-item">
                      <WalletOutlined />
                      <Text strong className="total-price">
                        {formatMoney(booking.totalPrice)} đ
                      </Text>
                    </div>
                  </div>
                  
                  <div className="booking-card__actions">
                    <Space>
                      {(booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.PENDING_PAYMENT) && (
                        <Button 
                          danger 
                          onClick={() => handleCancel(booking.bookingCode)}
                        >
                          Hủy đặt phòng
                        </Button>
                      )}
                      <Button type="default">Xem chi tiết</Button>
                    </Space>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
