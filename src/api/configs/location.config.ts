import type { ProfileLocationFilter } from "../../common/types/profile";
import axiosClient from "../axiosClient";
import type {
  LocationCommentPayloadDto,
  LocationDto,
  LocationParamDto,
  RelatedLocationParamDto,
  LocationResponseDto,
  LocationTypeDto,
  PaginatedLocationDto,
} from "../dtos/location.dto";
import { LocationEndpoint } from "../endpoints/location.endpoint";

export const getAllLocationType = async (): Promise<LocationTypeDto[]> => {
  const response = await axiosClient.get(
    LocationEndpoint.GET_ALL_LOCATION_TYPE,
  );
  return response.data;
};

export const getLocationByFilter = async (
  filter: ProfileLocationFilter,
): Promise<PaginatedLocationDto> => {
  const response = await axiosClient.get(
    LocationEndpoint.GET_LOCATION_BY_FILTER,
    {
      params: filter,
    },
  );
  return response.data;
};

export const getLocationByCode = async (
  locationCode: string,
): Promise<LocationResponseDto> => {
  const response = await axiosClient.get(
    LocationEndpoint.GET_LOCATION_BY_CODE,
    {
      params: { locationCode },
    },
  );
  return response.data;
};

export const getRelatedLocation = async (
  params: RelatedLocationParamDto,
): Promise<PaginatedLocationDto> => {
  const response = await axiosClient.get(LocationEndpoint.GET_RELATED_LOCATION, {
    params,
  });
  return response.data;
};

export const createLocation = async (payload: LocationDto): Promise<any> => {
  const response = await axiosClient.post(
    LocationEndpoint.CREATE_LOCATION,
    payload,
  );
  return response.data;
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
