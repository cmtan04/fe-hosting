export interface UserProfileResponseDto {
  id?: number;
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
  userName?: string;
  fullName?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  userDescription?: string;
  userNote?: string;
  phone?: string;
  fullAddress?: string;
  userWard?: string;
  userDistrict?: string;
  userCity?: string;
  userProvince?: string;
  userCountry?: string;
  userPortal?: string;

  userLat?: string;
  userLong?: string;
}

export interface UserAddressDto {
  fullAddress?: string;
  userWard?: string;
  userDistrict?: string;
  userCity?: string;
  userProvince?: string;
  userCountry?: string;
  userPortal?: string;

  userLat?: string;
  userLong?: string;
}

export class UserResponseDto {
  id?: number;
  username?: string;
  email?: string;
  fullName?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  phone?: string;
  fullAddress?: string;
  userWard?: string;
  userDistrict?: string;
  userCity?: string;
  userProvince?: string;
  userCountry?: string;
  userPortal?: string;
  userLat?: string;
  userLong?: string;
  userDescription?: string;
  userNote?: string;
}
