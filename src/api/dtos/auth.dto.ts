export interface SignUpPayloadDto {
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: Date;
}

export interface SignUpResponseDto {
  message: string;
  access_token: string;
}

export interface SignInPayloadDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignInResponseDto {
  access_token: string;
  refresh_token?: string;
  message?: string;
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
  access_token: string;
}

export interface RefreshTokenPayloadDto {
  refresh_token: string;
}

export interface RefreshTokenResponseDto {
  message: string;
  access_token: string;
}
