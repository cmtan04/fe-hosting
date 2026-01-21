import { Button, Form } from "antd";
import background from "../../../assets/images/auth/authBackGround.jpg";
import back from "../../../assets/svg/icn-back_black.svg";
import { ROUTER_PATH } from "../../../router/Route";
import { useNavigate } from "react-router-dom";
import "../auth.scss";
import "./resetPassword.scss";
import { FormPassword } from "../../../components/FormPassword/formPassword";
import { PASSWORD_REGEX } from "../../../common/constants/regexs";

export const ResetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onSubmit = () => {
    navigate(ROUTER_PATH.SIGN_IN);
  };
  return (
    <div className="auth">
      <div className="auth__banner">
        <img src={background} alt="" />
      </div>
      <div className="reset_password">
        <div className="reset_password-wrapper">
          <div className="reset_password-section-1">
            <img
              src={back}
              alt=""
              onClick={() => {
                navigate(ROUTER_PATH.VERIFY_EMAIL);
              }}
            />
            <p className="title">Đặt lại mật khẩu</p>
          </div>
          <div className="forgot_password-section-2">
            <p className="description">
              Mật khẩu mới phải khác với mật khẩu trước đó.
            </p>
          </div>
          <div className="reset_password-section-3">
            <Form form={form} onFinish={onSubmit}>
              <FormPassword
                name="password"
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu mới"
                vertical={true}
                formItemProps={{
                  rules: [
                    { required: true, message: "Vui lòng nhập mật khẩu." },
                    {
                      pattern: PASSWORD_REGEX,
                      message:
                        "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ in hoa và 1 ký tự đặc biệt.",
                    },
                  ],
                }}
              />

              <FormPassword
                name="confirm_password"
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu"
                vertical={true}
                formItemProps={{
                  rules: [
                    { required: true, message: "Vui lòng nhập lại mật khẩu." },
                    {
                      pattern: PASSWORD_REGEX,
                      message:
                        "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ in hoa và 1 ký tự đặc biệt.",
                    },
                  ],
                }}
              />
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
