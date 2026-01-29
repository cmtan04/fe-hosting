import axiosClient from "../axiosClient";
import type {
  ForgotPasswordPayloadDto,
  ForgotPasswordResponseDto,
  ResetPasswordPayloadDto,
  ResetPasswordResponseDto,
  SendOtpPayloadDto,
  SendOtpResponseDto,
  SignInPayloadDto,
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
): Promise<SignUpResponseDto> => {
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
  const response = await axiosClient.put(AuthEndPoints.RESET_PASSWORD, payload);
  return response.data;
};

export const sendOtp = async (
  payload: SendOtpPayloadDto,
): Promise<SendOtpResponseDto> => {
  const response = await axiosClient.put(AuthEndPoints.SEND_OTP, payload);
  return response.data;
};

export const resendOtp = async (
  payload: SendOtpPayloadDto,
): Promise<SendOtpResponseDto> => {
  const response = await axiosClient.put(AuthEndPoints.RESEND_OTP, payload);
  return response.data;
};

export const verifyOtp = async (
  payload: VerifyEmailPayloadDto,
): Promise<VerifyEmailResponseDto> => {
  const response = await axiosClient.put(AuthEndPoints.VERIFY_OTP, payload);
  return response.data;
};
