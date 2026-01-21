import "../auth.scss";
import "./signin.scss";
import bgLogin from "../../../assets/bg-login.jpg";
import { Button, Form } from "antd";
import { FormInput } from "../../../components/FormInput/formInput";
import { FormPassword } from "../../../components/FormPassword/formPassword";
import { useNavigate } from "react-router";
import { ROUTER_PATH } from "../../../router/Route";

export const SignIn = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onSubmit = () => {
    navigate(ROUTER_PATH.DASH_BOARD);
  };
  return (
    <div className="auth">
      <div className="auth__banner">
        <img src={bgLogin} alt="" />
      </div>
      <div className="auth__layout sign_in">
        <Form form={form} onFinish={onSubmit} className="sign_in-form">
          <div className="form-row-1">
            <h1 className="sign_in-title">Đăng nhập</h1>
          </div>
          <div className="form-row-2">
            <FormInput
              label="Tài khoản"
              name="account"
              placeholder="Nhập tài khoản đăng nhập"
              vertical={true}
            />
            <FormPassword
              name="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu đăng nhập"
              vertical={true}
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
