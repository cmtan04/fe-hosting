import axiosClient from "../axiosClient";
import type {
  ForgotPasswordPayloadDto,
  ForgotPasswordResponseDto,
  RefreshTokenPayloadDto,
  RefreshTokenResponseDto,
  ResetPasswordPayloadDto,
  ResetPasswordResponseDto,
  SendOtpPayloadDto,
  SendOtpResponseDto,
  SignInPayloadDto,
  SignInResponseDto,
  SignUpPayloadDto,
  SignUpResponseDto,
  VerifyEmailPayloadDto,
  VerifyEmailResponseDto,
} from "../dtos/auth.dto";
import { AuthEndPoints } from "../endpoints/auth.endpoint";

export const signUp = async (
  payload: SignUpPayloadDto,
): Promise<SignUpResponseDto> => {
  const response = await axiosClient.post(AuthEndPoints.SIGN_UP, payload);
  return response.data;
};

export const signIn = async (
  payload: SignInPayloadDto,
): Promise<SignInResponseDto> => {
  const response = await axiosClient.post(AuthEndPoints.SIGN_IN, payload);
  return response.data;
};

export const forgotPassword = async (
  payload: ForgotPasswordPayloadDto,
): Promise<ForgotPasswordResponseDto> => {
  const response = await axiosClient.post(
    AuthEndPoints.FORGOT_PASSWORD,
    payload,
  );
  return response.data;
};

export const resetPassword = async (
  payload: ResetPasswordPayloadDto,
): Promise<ResetPasswordResponseDto> => {
  const response = await axiosClient.post(
    AuthEndPoints.RESET_PASSWORD,
    payload,
  );
  return response.data;
};

export const sendOtp = async (
  payload: SendOtpPayloadDto,
): Promise<SendOtpResponseDto> => {
  const response = await axiosClient.post(AuthEndPoints.SEND_OTP, payload);
  return response.data;
};

export const resendOtp = async (
  payload: SendOtpPayloadDto,
): Promise<SendOtpResponseDto> => {
  const response = await axiosClient.post(AuthEndPoints.RESEND_OTP, payload);
  return response.data;
};

export const verifyOtp = async (
  payload: VerifyEmailPayloadDto,
): Promise<VerifyEmailResponseDto> => {
  const response = await axiosClient.post(AuthEndPoints.VERIFY_OTP, payload);
  return response.data;
};

export const refreshToken = async (
  payload: RefreshTokenPayloadDto,
): Promise<RefreshTokenResponseDto> => {
  const response = await axiosClient.post(AuthEndPoints.REFRESH, payload);
  return response.data;
};
