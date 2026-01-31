export interface SignUpPayloadDto {
  userName: string;
  email: string;
  password: string;
}

export interface SignUpResponseDto {
  message: string;
}

export interface SignInPayloadDto {
  email: string;
  password: string;
}

export interface SignInResponseDto {
  access_token: string;
}

export interface ForgotPasswordPayloadDto {
  email: string;
}

export interface ForgotPasswordResponseDto {
  message: string;
}

export interface ResetPasswordPayloadDto {
  oldPassword: string;
  newPassword: string;
}

export interface ResetPasswordResponseDto {
  message: string;
}

export interface SendOtpPayloadDto {
  email: string;
}

export interface SendOtpResponseDto {
  message: string;
}

export interface VerifyEmailPayloadDto {
  email: string;
  otp: string;
}

export interface VerifyEmailResponseDto {
  isVerify: boolean;
}
