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
  addRessPortal: string;
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
  minTimeLimit?: number;
  maxTimeLimit?: number;
  hasRent?: number;
  userRentCd?: string;
  locationDescription?: string;
  locationNote?: string;
  locationStatus: number;
  locationRate?: number;
}
