import { Button, Checkbox, Form } from "antd";
import { useEffect } from "react";
import { FormInput } from "../../../components/FormInput/formInput";
import { FormPassword } from "../../../components/FormPassword/formPassword";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "../../../router/Route";
import background from "../../../assets/images/auth/authBackGround.jpg";
import "./signin.scss";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../../common/constants/regexs";
import { useLoading } from "../../../providers/loadingProvider";
import { useNotification } from "../../../providers/notificationProvider";
import type { SignInPayloadDto } from "../../../api/dtos/auth.dto";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "../../../common/constants/constants";
import { isAxiosError } from "axios";
import { useAuth } from "../../../common/contexts/authContext";
import {
  clearRememberedSignIn,
  getRememberedSignIn,
  setRememberedSignIn,
} from "../../../common/utils/authStorage";

type SignInLocationState = {
  email?: string;
  redirectTo?: string;
  from?: string;
};

const getSafeRedirectPath = (redirectPath: string | undefined) => {
  if (!redirectPath) {
    return undefined;
  }

  if (!redirectPath.startsWith("/") || redirectPath.startsWith("//")) {
    return undefined;
  }

  if (redirectPath === ROUTER_PATH.SIGN_IN) {
    return undefined;
  }

  return redirectPath;
};

export const SignIn = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const { signIn } = useAuth();
  const locationState = location.state as SignInLocationState | null;
  const rememberedSignIn = getRememberedSignIn();

  const redirectPath =
    getSafeRedirectPath(locationState?.redirectTo) ??
    getSafeRedirectPath(locationState?.from) ??
    ROUTER_PATH.HOME;

  useEffect(() => {
    form.setFieldsValue({
      email: locationState?.email ?? rememberedSignIn.email ?? undefined,
      rememberMe: rememberedSignIn.remember,
    });
  }, [form, locationState?.email, rememberedSignIn.email, rememberedSignIn.remember]);

  const onSubmit = async () => {
    const rememberMe = Boolean(form.getFieldValue("rememberMe"));
    const payload: SignInPayloadDto = {
      email: form.getFieldValue("email"),
      password: form.getFieldValue("password"),
    };

    setLoading(true);
    try {
      const data = await signIn(payload, { remember: rememberMe });
      if (rememberMe) {
        setRememberedSignIn(payload.email);
      } else {
        clearRememberedSignIn();
      }
      showNotification(data.message ?? "Đăng nhập thành công!", NOTI_SUCCESS);
      navigate(redirectPath, { replace: true });
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
            
            <Form.Item
              className="remember-me"
              name="rememberMe"
              valuePropName="checked"
            >
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
          </div>
          <div className="form-row-3">
            <Button htmlType="submit" className="button-submit">
              Đăng nhập
            </Button>
          </div>
          <div className="form-row-4">
            <p className="description">
              Bạn chưa có tài khoản?{" "}
              <button
                type="button"
                className="sign-up-link"
                onClick={() => navigate(ROUTER_PATH.SIGN_UP)}
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};
