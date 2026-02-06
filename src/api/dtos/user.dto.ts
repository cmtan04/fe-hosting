export interface UserProfileResponseDto {
  avatarUrl: string;
  bio: string;
  coverUrl: string;
  dateOfBirth: string;
  email: string;
  fullAddress: string;
  fullName: string;
  isEmailVerified: number;
  phone: string;
  role: string;
  userCity: string;
  userCode: string;
  userCountry: string;
  userDescription: string;
  userDistrict: string;
  userLat: string;
  userLong: string;
  userNote: string;
  userPortal: string;
  userProvince: string;
  userWard: string;
  username: string;
}

export interface UserUpdatePayloadDto {
  userCode: string;
  data: UserProfileResponseDto;
}
