import type { ChatAndCommentDto } from "./common.dto";

export interface LocationTypeDto {
  id: number;
  typeCode: string;
  typeName: string;
  typeDescription?: string;
  typeLogo?: string;
  typeBackGround?: string;
}

export interface LocationPricingDto {
  priceStart: number;
  priceEnd?: number;
  priceAfterDeal: number;
}

export interface LocationAvailabilityDto {
  hasTimeLimit?: boolean;
  availableFrom?: string;
  availableTo?: string;
  isRented?: boolean;
}

export interface LocationAddressDto {
  addressCode?: string;
  name: string;
  fullAddress: string;
  ward: string;
  district: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  region: string;
  latitude: number;
  longitude: number;
  description?: string;
  note?: string;
}

export interface LocationMediaDto {
  mediaCode?: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  displayOrder?: number;
  isLogo?: boolean;
}

export interface CreateLocationRequestDto {
  typeCode: string;
  name: string;
  description?: string;
  note?: string;
  area?: number;
  pricing: LocationPricingDto;
  availability?: LocationAvailabilityDto;
  primaryAddress: LocationAddressDto;
  serviceCodes?: string[];
  media?: LocationMediaDto[];
}

export interface UpdateLocationRequestDto
  extends Partial<CreateLocationRequestDto> {}

export interface ServiceDto {
  serviceCode: string;
  serviceName: string;
  serviceDescription?: string;
  serviceLogo?: string;
  serviceBackGround?: string;
  servicePrice: number | string;
  serviceDiscount?: number;
  isActive?: number;
}

export interface LocationOwnerDto {
  userCode: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  phone?: string | null;
  fullAddress?: string | null;
  city?: string | null;
}

export interface LocationTypeSummaryDto {
  code: string;
  name: string;
  description?: string;
  logo?: string;
  background?: string;
}

export interface LocationSummaryDto {
  locationCode: string;
  name: string;
  description?: string;
  note?: string;
  logo?: string;
  area?: number | null;
  rating: number;
  pricing: LocationPricingDto;
  availability: LocationAvailabilityDto;
  type: LocationTypeSummaryDto;
  primaryAddress: LocationAddressDto | null;
  owner: LocationOwnerDto;
}

export interface LocationDetailApiDto extends LocationSummaryDto {
  addresses: LocationAddressDto[];
  services: ServiceDto[];
  media: LocationMediaDto[];
}

export interface PaginatedLocationApiDto {
  data: LocationSummaryDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Compatibility view models for existing UI surfaces.
export interface LocationDto {
  locationCode: string;
  typeCode: string;
  typeName: string;
  typeDescription?: string;
  typeLogo?: string;
  typeBackGround?: string;
  locationName: string;
  locationDescription?: string;
  locationNote?: string;
  locationLogo?: string;
  locationPriceStart: number;
  locationPriceEnd: number;
  locationPriceAfterDeal: number;
  locationArea?: number | null;
  minTime?: string;
  maxTime?: string;
  hasRent: number;
  renterCode: string | null;
  locationRate: number;
  ownerCode: string;
  ownerName: string;
  ownerEmail: string;
  ownerAvatar?: string | null;
  ownerPhone?: string | null;
  ownerAddress?: string | null;
  ownerCity?: string | null;
  services?: ServiceDto[];
  address?: AddressDto[];
  media?: LocationMediaDto[];
}

export interface AddressDto {
  addressCode?: string;
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
  addressDescription?: string;
  addressNote?: string;
  addressStatus?: string;
  addressType?: string;
}

export interface PaginatedLocationDto {
  data: LocationDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LocationCommentPayloadDto {
  commentId: number;
  locationCode: string;
  content: ChatAndCommentDto;
}

export interface LocationParamDto {
  locationCode?: string;
  limit: number;
  page: number;
}

export interface RelatedLocationParamDto {
  locationCode: string;
  page?: number;
  limit?: number;
}
