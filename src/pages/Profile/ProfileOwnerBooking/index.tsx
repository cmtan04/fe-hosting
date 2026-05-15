import { Card, Tag, Empty, Space, Typography, message, Avatar } from "antd";
import { useEffect, useState } from "react";
import { getOwnerBookings } from "@/api/configs/booking.config";
import { BookingStatus, PaymentStatus, type BookingResponseDto } from "@/api/dtos/booking.dto";
import { formatMoney } from "@/common/contexts/format";
import { CalendarOutlined, EnvironmentOutlined, WalletOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./style.scss";

const { Text, Title } = Typography;

export const ProfileOwnerBooking = () => {
  const [bookings, setBookings] = useState<BookingResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getOwnerBookings({ page: 1, limit: 100 });
      setBookings(res.data);
    } catch (error) {
      message.error("Không thể tải danh sách booking của khách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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
    <div className="profile-owner-booking">
      <Title level={3} className="page-title">Quản lý Booking khách đặt</Title>
      
      {loading ? (
        <div className="loading-container">Đang tải...</div>
      ) : bookings.length === 0 ? (
        <Empty description="Chưa có khách nào đặt phòng của bạn" />
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <Card key={booking.bookingCode} className="booking-card">
              <div className="booking-card__content">
                <div className="booking-card__image-wrapper">
                  <img src={booking.location.logo || "/placeholder-room.jpg"} alt="location" />
                </div>
                
                <div className="booking-card__info">
                  <div className="booking-card__header">
                    <div>
                      <Title level={4} className="location-name">{booking.location.name}</Title>
                      <Space className="guest-info">
                        <Avatar icon={<UserOutlined />} src={booking.guest.avatarUrl} size="small" />
                        <Text className="guest-name">Khách: {booking.guest.username}</Text>
                      </Space>
                    </div>
                    <Space direction="vertical" align="end">
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
                        Doanh thu: {formatMoney(booking.totalPrice)} đ
                      </Text>
                    </div>

                    {booking.cancellationFee && booking.cancellationFee > 0 && (
                      <div className="detail-item fee-info">
                        <Text type="danger">Phí hủy nhận được: {formatMoney(booking.cancellationFee)} đ</Text>
                      </div>
                    )}
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
