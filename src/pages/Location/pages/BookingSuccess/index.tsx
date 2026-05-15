import { Button, Result } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTER_PATH } from "@/router/Route";
import "./style.scss";

export const BookingSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingCode = searchParams.get("bookingCode");

  return (
    <div className="booking-success-page">
      <div className="booking-success-card">
        <Result
          status="success"
          title="Đặt phòng thành công!"
          subTitle={`Mã booking của bạn là: ${bookingCode || "N/A"}. Bạn có thể xem chi tiết trong phần Quản lý Booking.`}
          extra={[
            <Button
              type="primary"
              key="console"
              className="btn-primary"
              onClick={() => navigate(ROUTER_PATH.PROFILE_BOOKING)}
            >
              Xem Booking của tôi
            </Button>,
            <Button
              key="buy"
              className="btn-outline"
              onClick={() => navigate(ROUTER_PATH.HOME)}
            >
              Trang chủ
            </Button>,
          ]}
        />
      </div>
    </div>
  );
};
