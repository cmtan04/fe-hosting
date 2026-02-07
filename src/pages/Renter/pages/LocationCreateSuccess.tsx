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
      <Lottie className="lottie-icon" animationData={succesCheck} />
      <Button
        htmlType="button"
        className="button-submit"
        onClick={() => {
          navigate(ROUTER_PATH.HOME);
        }}
      >
        Hoàn tất
      </Button>
    </div>
  );
};
