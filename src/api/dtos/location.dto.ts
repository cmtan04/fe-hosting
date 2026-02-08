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
