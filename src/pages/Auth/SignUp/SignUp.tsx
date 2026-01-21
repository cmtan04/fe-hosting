import "../auth.scss";
import "./signup.scss";
import bgLogin from "../../../assets/bg-login.jpg";
import { Button, Form } from "antd";
import { FormInput } from "../../../components/FormInput/formInput";
import { FormPassword } from "../../../components/FormPassword/formPassword";
import { ROUTER_PATH } from "../../../router/Route";
import { useNavigate } from "react-router";

export const SignUp = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onSubmit = () => {};

  return (
    <div className="auth">
      <div className="auth__banner">
        <img src={bgLogin} alt="" />
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
              placeholder="Nhập họ tên đăng ký"
              vertical={true}
            />
            <FormInput
              label="Tài khoản"
              name="account"
              placeholder="Nhập tài khoản đăng ký"
              vertical={true}
            />
            <FormPassword
              name="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu đăng ký"
              vertical={true}
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
                Đăng nhập ngay
              </span>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};
