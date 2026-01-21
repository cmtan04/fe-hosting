import "../auth.scss";
import "./signup.scss";
import background from "../../../assets/images/auth/authBackGround.jpg";
import { Button, Form } from "antd";
import { FormInput } from "../../../components/FormInput/formInput";
import { FormPassword } from "../../../components/FormPassword/formPassword";
import { ROUTER_PATH } from "../../../router/Route";
import { useNavigate } from "react-router";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../../common/constants/regexs";
import { AUTH_FLOWTYPE } from "../../../common/constants/constants";

export const SignUp = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onSubmit = () => {
    navigate(ROUTER_PATH.VERIFY_EMAIL, {
      state: {
        email: form.getFieldValue("email"),
        type: AUTH_FLOWTYPE.SIGN_UP,
      },
    });
  };

  return (
    <div className="auth">
      <div className="auth__banner">
        <img src={background} alt="" />
      </div>
      <div className="auth__layout sign_up">
        <Form form={form} onFinish={onSubmit} className="sign_up-form">
          <div className="form-row-1">
            <h1 className="sign_up-title">Đăng ký</h1>
          </div>
          <div className="form-row-2">
            <FormInput
              label="Họ tên"
              name="account"
              placeholder="Nhập họ tên của bạn"
              vertical={true}
            />
            <FormInput
              label="Email"
              name="account"
              placeholder="Nhập email của bạn"
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
              placeholder="Nhập mật khẩu đăng ký"
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
              Đăng ký
            </Button>
          </div>
          <div className="form-row-4">
            <p className="description">
              Bạn đã có tài khoản?
              <span
                className="sign-up-link"
                onClick={() => navigate(ROUTER_PATH.SIGN_IN)}
              >
                Đăng nhập
              </span>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};
