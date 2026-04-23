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

const mapAddress = (address: LocationAddressDto) => ({
  addressCode: address.addressCode,
  addressName: address.name,
  fullAddress: address.fullAddress,
  addressWard: address.ward,
  addressDistrict: address.district,
  addressCity: address.city,
  addressProvince: address.province,
  addressCountry: address.country,
  addressPortal: address.postalCode,
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
  locationPriceStart: Number(location.pricing.priceStart ?? 0),
  locationPriceEnd: Number(
    location.pricing.priceEnd ?? location.pricing.priceStart ?? 0,
  ),
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
  typeCode: filter.locationType,
  typeName: filter.typeName,
  addressCity: filter.addressCity,
  addressRegion: filter.addressRegion,
  minPrice: filter.minPrice,
  maxPrice: filter.maxPrice,
  minArea: filter.minArea,
  maxArea: filter.maxArea,
  isRented:
    typeof filter.hasRent === "number" ? Number(filter.hasRent) === 1 : undefined,
  page: filter.page,
  limit: filter.limit,
});

export const getAllLocationType = async (): Promise<LocationTypeDto[]> => {
  const response = await axiosClient.get(LocationEndpoint.GET_ALL_LOCATION_TYPE);
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
  const response = await axiosClient.get(LocationEndpoint.GET_LOCATION_COMMENT, {
    params: payload,
  });
  return response.data;
};
