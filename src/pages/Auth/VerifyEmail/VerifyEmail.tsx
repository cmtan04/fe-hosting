import { Button, Form } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import background from "../../../assets/images/auth/authBackGround.jpg";
import back from "../../../assets/svg/icn-back_black.svg";
import { AUTH_FLOWTYPE } from "../../../common/constants/constants";
import OTPInput from "../../../components/FormOtp/formOtp";
import { ROUTER_PATH } from "../../../router/Route";
import "../auth.scss";
import "./verifyEmail.scss";

export const VerifyEmail = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = () => {
    if (location?.state?.type === AUTH_FLOWTYPE.SIGN_IN) {
      navigate(ROUTER_PATH.DASH_BOARD);
    } else if (location?.state?.type === AUTH_FLOWTYPE.SIGN_UP) {
      navigate(ROUTER_PATH.SIGN_IN);
    } else {
      navigate(ROUTER_PATH.RESET_PASSWORD);
    }
  };

  return (
    <div className="auth">
      <div className="auth__banner">
        <img src={background} alt="" />
      </div>
      <div className="verify_email">
        <div className="verify_email-wrapper">
          <div className="verify_email-section-1">
            <img
              src={back}
              alt=""
              onClick={() => {
                navigate(ROUTER_PATH.FORGOT_PASSWORD);
              }}
            />
            <p className="title">Xác nhận Email</p>
          </div>
          <div className="verify_email-section-2">
            <p className="description">
              <span className="email">{location?.state?.email}</span> đã được
              gửi link xác nhận. Vui lòng nhập mã xác nhận 4 chữ số trong email.
            </p>
          </div>
          <div className="verify_email-section-3">
            <Form form={form} onFinish={onSubmit}>
              <Form.Item
                label={<span>Nhập mã OTP</span>}
                name="otp"
                rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
              >
                <OTPInput />
              </Form.Item>

              <Button htmlType="submit" className="button-submit">
                Xác nhận
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
