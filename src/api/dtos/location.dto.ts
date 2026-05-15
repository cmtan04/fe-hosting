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
  price: number;
  priceUnit: string;
  priceAfterDeal?: number;
}

export interface LocationAvailabilityDto {
  hasTimeLimit?: boolean;
  availableFrom?: string;
  availableTo?: string;
  isRented?: boolean;
}

export interface LocationAddressDto {
  addressCode?: string;
  addressDetail?: string;
  fullAddress: string;
  ward: string;
  city: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
  description?: string;
  note?: string;
  name?: string;
  district?: string;
  province?: string;
  postalCode?: string;
}

export interface LocationMediaDto {
  mediaCode?: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  displayOrder?: number;
  isLogo?: boolean;
}

export type ServicePriceType = "FREE" | "PAID";

export interface LocationServiceSelectionDto {
  serviceCode?: string;
  name?: string;
  description?: string;
  isFree?: boolean;
  basePrice?: number;
  unit?: string;
  quantity?: number;
}

export interface CreateLocationRequestDto {
  typeCode: string;
  name: string;
  description?: string;
  note?: string;
  area?: number;
  cancellationFeePercent?: number;
  rescheduleFeePercent?: number;
  pricing: LocationPricingDto;
  availability?: LocationAvailabilityDto;
  primaryAddress: LocationAddressDto;
  services?: LocationServiceSelectionDto[];
  media?: LocationMediaDto[];
}

export interface UpdateLocationRequestDto extends Partial<CreateLocationRequestDto> {}

export interface ServiceDto {
  serviceCode: string;
  serviceName: string;
  description?: string;
  serviceDescription?: string;
  serviceLogo?: string;
  code?: string;
  name?: string;
  servicePrice?: number | string;
  servicePriceType?: ServicePriceType;
  serviceDiscount?: number;
  isActive?: boolean | number;
  isCustom?: boolean;
  category?: string;
  isFree?: boolean;
  basePrice?: number;
  unit?: string;
  quantity?: number;
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
  locationPrice: number;
  locationPriceUnit: string;
  locationPriceAfterDeal: number;
  locationArea?: number | null;
  minTime?: string;
  maxTime?: string;
  hasRent: number;
  renterCode: string | null;
  locationRate: number;
  cancellationFeePercent?: number;
  rescheduleFeePercent?: number;
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
