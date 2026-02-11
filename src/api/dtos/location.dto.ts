export interface LocationTypeDto {
  id: string;
  typeCode: string;
  typeName: string;
  typeDescription: string;
  typeLogo: string;
  typeBackGround: string;
}

export interface ServicePayloadDto {
  serviceCode: string;
}

export interface LocationAddressUpdateDto {
  addressName: string;
  fullAddress: string;
  addressWard: string;
  addressDistrict: string;
  addressCity: string;
  addressProvince: string;
  addressCountry: string;
  addressPortal: string;
  addressLat: string;
  addressLong: string;
  addressRegion: string;
  addressStatus: string;
  addressDescription?: string;
  addressNote?: string;
  addressType: string;
}

export interface LocationDto {
  typeCode: string;
  serviceCode: ServicePayloadDto[];
  locationAddress: LocationAddressUpdateDto[];
  locationName: string;
  locationLogo: string;
  locationPriceStart: number;
  locationPriceEnd: number;
  locationPriceAfterDeal: number;
  minTimeLimit?: string;
  maxTimeLimit?: string;
  hasRent?: number;
  userRentCd?: string;
  locationDescription?: string;
  locationNote?: string;
  locationStatus: number;
  locationRate?: number;
}

export interface LocationResponseDto {
  typeCode: string;
  locationName: string;
  locationLogo: string;
  ownerCode: string;
  locationCode: string;
  minTime: string;
  maxTime: string;
  locationPriceStart: string;
  locationPriceEnd: string;
  locationPriceAfterDeal: string;
  hasRent: number;
  renterCode: string | null;
  locationDescription: string;
  locationNote: string;
  locationRate: number;

  typeName: string;
  typeDescription: string;
  typeLogo: string;
  typeBackGround: string;

  ownerEmail: string;
  ownerAvatar: string | null;
  ownerCover: string | null;
  ownerPhone: string | null;
  ownerAddress: string | null;
  ownerCity: string | null;

  renterEmail: string | null;
  renterAvatar: string | null;
  renterCover: string | null;
  renterPhone: string | null;
  renterAddress: string | null;
  renterCity: string | null;

  ownerName: string;
  renterName: string | null;

  services: ServiceDto[];
  address: AddressDto[];
}

export interface ServiceDto {
  isActive: number;
  serviceBackGround: string;
  serviceCode: string;
  serviceDescription: string;
  serviceLogo: string;
  serviceName: string;
  serviceNote: string;
  servicePrice: string;
}

export interface AddressDto {
  addressCode: string;
  addressName: string;
  fullAddress: string;
  addressWard: string;
  addressDistrict: string;
  addressCity: string;
  addressProvince: string;
  addressCountry: string;
  addressPortal: string;
  addressLat: string;
  addressLong: string;
  addressRegion: string;
  addressStatus: string;
  addressDescription: string;
  addressNote: string;
  addressType: string;
}
