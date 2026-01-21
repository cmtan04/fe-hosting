import { Button, Form } from "antd";
import { FormInput } from "../../../components/FormInput/formInput";
import { FormPassword } from "../../../components/FormPassword/formPassword";
import { useNavigate } from "react-router";
import { ROUTER_PATH } from "../../../router/Route";
import background from "../../../assets/images/auth/authBackGround.jpg";
import "./signin.scss";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../../common/constants/regexs";
export const SignIn = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onSubmit = () => {
    navigate(ROUTER_PATH.HOME);
  };
  return (
    <div className="auth">
      <div className="auth__banner">
        <img src={background} alt="" />
      </div>
      <div className="auth__layout sign_in">
        <Form form={form} onFinish={onSubmit} className="sign_in-form">
          <div className="form-row-1">
            <h1 className="sign_in-title">Đăng nhập</h1>
          </div>
          <div className="form-row-2">
            <FormInput
              label="Email"
              name="email"
              placeholder="Nhập email đăng nhập"
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

            <FormPassword
              name="password"
              label="Mật khẩu"
              subLabel="Quên mật khẩu?"
              placeholder="Nhập mật khẩu đăng nhập"
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
          </div>
          <div className="form-row-3">
            <Button htmlType="submit" className="button-submit">
              Đăng nhập
            </Button>
          </div>
          <div className="form-row-4">
            <p className="description">
              Bạn chưa có tài khoản?{" "}
              <span
                className="sign-up-link"
                onClick={() => navigate(ROUTER_PATH.SIGN_UP)}
              >
                Đăng ký ngay
              </span>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};
