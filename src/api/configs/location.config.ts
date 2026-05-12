import type { ProfileLocationFilter } from "../../common/types/profile";
import axiosClient from "../axiosClient";
import type {
  CreateLocationRequestDto,
  LocationAddressDto,
  LocationCommentPayloadDto,
  LocationDetailApiDto,
  LocationDto,
  LocationParamDto,
  LocationSummaryDto,
  LocationTypeDto,
  PaginatedLocationApiDto,
  PaginatedLocationDto,
  RelatedLocationParamDto,
} from "../dtos/location.dto";
import { LocationEndpoint } from "../endpoints/location.endpoint";

const LOCATION_TYPE_CODE_MAP: Record<string, string> = {
  motel: "ROOM",
  room: "ROOM",
  apartment: "APARTMENT",
  office: "OFFICE",
  "full-house": "HOUSE",
  full_house: "HOUSE",
  house: "HOUSE",
  dorm: "DORM",
  venue: "SHOP",
  shop: "SHOP",
};

export const normalizeLocationTypeCode = (value?: string | null) => {
  if (!value) return undefined;
  return value
    .split(',')
    .map(val => {
      const trimmedValue = val.trim();
      return LOCATION_TYPE_CODE_MAP[trimmedValue.toLowerCase()] ?? trimmedValue;
    })
    .filter(Boolean)
    .join(',');
};

const mapAddress = (address: LocationAddressDto) => ({
  addressCode: address.addressCode,
  addressName: address.addressDetail,
  fullAddress: address.fullAddress,
  addressWard: address.ward,
  addressDistrict: address.ward,
  addressCity: address.city,
  addressProvince: address.city,
  addressCountry: address.country,
  addressPortal: "",
  addressLat: String(address.latitude),
  addressLong: String(address.longitude),
  addressRegion: address.region,
  addressDescription: address.description,
  addressNote: address.note,
  addressStatus: "0",
  addressType: "1",
});

const mapLocationSummary = (location: LocationSummaryDto): LocationDto => ({
  locationCode: location.locationCode,
  typeCode: location.type.code,
  typeName: location.type.name,
  typeDescription: location.type.description,
  typeLogo: location.type.logo,
  typeBackGround: location.type.background,
  locationName: location.name,
  locationDescription: location.description,
  locationNote: location.note,
  locationLogo: location.logo,
  locationPrice: Number(location.pricing.price ?? 0),
  locationPriceUnit: location.pricing.priceUnit || "tháng",
  locationPriceAfterDeal: Number(location.pricing.priceAfterDeal ?? 0),
  locationArea: location.area,
  minTime: location.availability.availableFrom,
  maxTime: location.availability.availableTo,
  hasRent: location.availability.isRented ? 1 : 0,
  renterCode: location.availability.isRented ? "RENTED" : null,
  locationRate: Number(location.rating ?? 0),
  ownerCode: location.owner.userCode,
  ownerName: location.owner.username,
  ownerEmail: location.owner.email,
  ownerAvatar: location.owner.avatarUrl,
  ownerPhone: location.owner.phone,
  ownerAddress: location.owner.fullAddress,
  ownerCity: location.owner.city,
  address: location.primaryAddress ? [mapAddress(location.primaryAddress)] : [],
  services: [],
  media: [],
});

const mapLocationDetail = (location: LocationDetailApiDto): LocationDto => ({
  ...mapLocationSummary(location),
  services: location.services?.map((service) => ({
    ...service,
    servicePrice: Number(service.servicePrice ?? 0),
    isActive: 1,
  })),
  address: location.addresses?.map(mapAddress),
  media: location.media,
});

const mapLocationListResponse = (
  response: PaginatedLocationApiDto,
): PaginatedLocationDto => ({
  ...response,
  data: response.data.map(mapLocationSummary),
});

const toLocationQueryParams = (filter: ProfileLocationFilter) => ({
  keyword: filter.searchValue,
  typeCode: normalizeLocationTypeCode(filter.locationType),
  typeName: filter.typeName,
  addressCity: filter.addressCity,
  addressRegion: filter.addressRegion,
  minPrice: filter.minPrice,
  maxPrice: filter.maxPrice,
  minArea: filter.minArea,
  maxArea: filter.maxArea,
  isRented:
    typeof filter.hasRent === "number"
      ? Number(filter.hasRent) === 1
      : undefined,
  page: filter.page,
  limit: filter.limit,
  sortBy: filter.sortBy,
  sortOrder: filter.sortOrder,
});

export const getAllLocationType = async (): Promise<LocationTypeDto[]> => {
  const response = await axiosClient.get(
    LocationEndpoint.GET_ALL_LOCATION_TYPE,
  );
  return response.data;
};

export const getLocationByFilter = async (
  filter: ProfileLocationFilter,
): Promise<PaginatedLocationDto> => {
  const response = await axiosClient.get<PaginatedLocationApiDto>(
    LocationEndpoint.GET_LOCATIONS,
    {
      params: toLocationQueryParams(filter),
    },
  );

  return mapLocationListResponse(response.data);
};

export const getOwnerLocations = async (
  ownerCode: string,
): Promise<LocationDto[]> => {
  const response = await axiosClient.get<LocationSummaryDto[]>(
    `${LocationEndpoint.GET_OWNER_LOCATIONS}/${ownerCode}`,
  );
  return response.data.map(mapLocationSummary);
};

export const getLocationByCode = async (
  locationCode: string,
): Promise<LocationDto> => {
  const response = await axiosClient.get<LocationDetailApiDto>(
    `${LocationEndpoint.GET_LOCATION_BY_CODE}/${locationCode}`,
  );

  return mapLocationDetail(response.data);
};

export const getRelatedLocation = async (
  params: RelatedLocationParamDto,
): Promise<PaginatedLocationDto> => {
  const response = await axiosClient.get<PaginatedLocationApiDto>(
    `${LocationEndpoint.GET_RELATED_LOCATION}/${params.locationCode}/related`,
    {
      params: {
        page: params.page,
        limit: params.limit,
      },
    },
  );

  return mapLocationListResponse(response.data);
};

export const createLocation = async (
  payload: CreateLocationRequestDto,
): Promise<{ message: string; data: LocationDto }> => {
  const response = await axiosClient.post<{
    message: string;
    data: LocationDetailApiDto;
  }>(LocationEndpoint.CREATE_LOCATION, payload);

  return {
    message: response.data.message,
    data: mapLocationDetail(response.data.data),
  };
};

export const updateLocation = async (
  locationCode: string,
  payload: Partial<CreateLocationRequestDto>,
): Promise<{ message: string; data: LocationDto }> => {
  const response = await axiosClient.patch<{
    message: string;
    data: LocationDetailApiDto;
  }>(`${LocationEndpoint.UPDATE_LOCATION}/${locationCode}`, payload);

  return {
    message: response.data.message,
    data: mapLocationDetail(response.data.data),
  };
};

export const createNewComment = async (
  payload: LocationCommentPayloadDto,
): Promise<any> => {
  const response = await axiosClient.post(
    LocationEndpoint.CREATE_LOCATION_COMMENT,
    payload,
  );
  return response.data;
};

export const getComment = async (payload: LocationParamDto): Promise<any> => {
  const response = await axiosClient.get(
    LocationEndpoint.GET_LOCATION_COMMENT,
    {
      params: payload,
    },
  );
  return response.data;
};
