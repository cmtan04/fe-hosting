import { useMutation } from "@tanstack/react-query";
import { Button, Form } from "antd";
import { isAxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { resendOtp, verifyOtp } from "../../../api/configs/auth.config";
import type {
  SendOtpPayloadDto,
  VerifyEmailPayloadDto,
} from "../../../api/dtos/auth.dto";
import background from "../../../assets/images/auth/authBackGround.jpg";
import back from "../../../assets/svg/icn-back_black.svg";
import {
  AUTH_FLOWTYPE,
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "../../../common/constants/constants";
import OTPInput from "../../../components/FormOtp/formOtp";
import { useLoading } from "../../../providers/loadingProvider";
import { useNotification } from "../../../providers/notificationProvider";
import { ROUTER_PATH } from "../../../router/Route";
import "../auth.scss";
import "./verifyEmail.scss";

export const VerifyEmail = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();

  const verifyEmailMutation = useMutation({
    mutationFn: (payload: VerifyEmailPayloadDto) => verifyOtp(payload),
    onSuccess: (data) => {
      if (data.isVerify) {
        showNotification("Xác thực email thành công.", NOTI_SUCCESS);
        if (location?.state?.type === AUTH_FLOWTYPE.SIGN_IN) {
          navigate(ROUTER_PATH.HOME);
        } else if (location?.state?.type === AUTH_FLOWTYPE.SIGN_UP) {
          navigate(ROUTER_PATH.SIGN_IN);
        } else {
          navigate(ROUTER_PATH.RESET_PASSWORD);
        }
      } else {
        showNotification(DEFAULT_MESSAGE, NOTI_ERROR);
      }
      localStorage.setItem("token", data.access_token);
    },
    onError: (error) => {
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
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: (payload: SendOtpPayloadDto) => resendOtp(payload),
    onSuccess: (data) => {
      showNotification(data.message, NOTI_SUCCESS);
      form.resetFields();
    },
    onError: (error) => {
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
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const onSubmit = () => {
    const payload: VerifyEmailPayloadDto = {
      email: location?.state?.email,
      otp: form.getFieldValue("otp"),
    };

    verifyEmailMutation.mutate(payload);
  };

  const onResendOtp = () => {
    const payload: SendOtpPayloadDto = {
      email: location?.state?.email,
    };

    resendOtpMutation.mutate(payload);
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
                navigate(-1);
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
              <p className="resend" onClick={onResendOtp}>
                Gửi lại mã xác nhận
              </p>
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
