import Lottie from "lottie-react";
import type { RenterProps } from "../RenterLayout";
import succesCheck from "../../../assets/lotties/success-check.json";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "../../../router/Route";
export const LocationCreateSucees = (props: RenterProps) => {
  const navigate = useNavigate();
  return (
    <div className="renter__success">
      <div className="renter__success-header">
        <h1 className="header-title">Tạo địa điểm cho thuê thành công</h1>
        <p className="header-subTitle">
          Giờ đây địa điểm của bạn đã có thể được mọi người tiếp cận và biết
          đến.
        </p>
      </div>
      <Lottie className="lottie-icon" animationData={succesCheck} />
      <Button
        htmlType="button"
        className="button-submit"
        onClick={() => {
          navigate(ROUTER_PATH.HOME);
        }}
      >
        Đi tới không gian của tôi.
      </Button>
    </div>
  );
};
