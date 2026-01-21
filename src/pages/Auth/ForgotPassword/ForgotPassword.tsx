import "../auth.scss";
import "./forgotPassword.scss";
import { Button, Form } from "antd";
import background from "../../../assets/images/auth/authBackGround.jpg";
import back from "../../../assets/svg/icn-back_black.svg";
import { FormInput } from "../../../components/FormInput/formInput";
import { EMAIL_REGEX } from "../../../common/constants/regexs";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "../../../router/Route";
import { AUTH_FLOWTYPE } from "../../../common/constants/constants";
export const ForgotPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onSubmit = () => {
    navigate(ROUTER_PATH.VERIFY_EMAIL, {
      state: {
        email: form.getFieldValue("email"),
        type: AUTH_FLOWTYPE.FORGOT,
      },
    });
  };
  return (
    <div className="auth">
      <div className="auth__banner">
        <img src={background} alt="" />
      </div>
      <div className="forgot_password">
        <div className="forgot_password-wrapper">
          <div className="forgot_password-section-1">
            <img
              src={back}
              alt=""
              onClick={() => {
                navigate(ROUTER_PATH.SIGN_IN);
              }}
            />
            <p className="title">Quên mật khẩu</p>
          </div>
          <div className="forgot_password-section-2">
            <p className="description">
              Vui lòng nhập địa chỉ email để đặt lại mật khẩu.
            </p>
          </div>
          <div className="forgot_password-section-3">
            <Form form={form} onFinish={onSubmit}>
              <FormInput
                label="Email"
                name="email"
                placeholder="Nhập email đã đăng ký tại Bookings."
                vertical={true}
                formItemProps={{
                  rules: [
                    { required: true, message: "Vui lòng nhập email của bạn." },
                    {
                      pattern: EMAIL_REGEX,
                      message: "Vui lòng nhập đúng định dạng email.",
                    },
                  ],
                }}
              />

              <Button htmlType="submit" className="button-submit">
                Tiếp tục
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
