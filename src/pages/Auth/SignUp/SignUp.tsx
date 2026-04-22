import "../auth.scss";
import "./signup.scss";
import background from "../../../assets/images/auth/authBackGround.jpg";
import { Button, Form } from "antd";
import { FormInput } from "../../../components/FormInput/formInput";
import { FormPassword } from "../../../components/FormPassword/formPassword";
import { ROUTER_PATH } from "../../../router/Route";
import { useNavigate } from "react-router";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../../common/constants/regexs";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "../../../common/constants/constants";
import type { SignUpPayloadDto } from "../../../api/dtos/auth.dto";
import { useLoading } from "../../../providers/loadingProvider";
import { isAxiosError } from "axios";
import { useNotification } from "../../../providers/notificationProvider";
import { useAuth } from "../../../common/contexts/authContext";

export const SignUp = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const { signUp } = useAuth();

  const onSubmit = async () => {
    const payload: SignUpPayloadDto = {
      userName: form.getFieldValue("name"),
      email: form.getFieldValue("account"),
      password: form.getFieldValue("password"),
    };

    setLoading(true);
    try {
      const data = await signUp(payload);
      showNotification(data.message, NOTI_SUCCESS);
      navigate(ROUTER_PATH.SIGN_IN, {
        replace: true,
        state: {
          email: payload.email,
        },
      });
    } catch (error) {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === "string") {
          message = apiMessage;
        } else if (Array.isArray(apiMessage) && apiMessage[0]) {
          message = apiMessage[0];
        }
      }
      showNotification(message, NOTI_ERROR);
    } finally {
      setLoading(false);
    }
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
              name="name"
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
              Bạn đã có tài khoản?{" "}
              <button
                type="button"
                className="sign-up-link"
                onClick={() => navigate(ROUTER_PATH.SIGN_IN)}
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};
