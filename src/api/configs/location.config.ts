import axiosClient from "../axiosClient";
import type { LocationDto, LocationTypeDto } from "../dtos/location.dto";
import { LocationEndpoint } from "../endpoints/location.endpoint";

export const getAllLocationType = async (): Promise<LocationTypeDto[]> => {
  const response = await axiosClient.get(
    LocationEndpoint.GET_ALL_LOCATION_TYPE,
  );
  return response.data;
};

export const getLocationByFilter = async (
  filter: any,
): Promise<LocationDto[]> => {
  const response = await axiosClient.get(
    LocationEndpoint.GET_LOCATION_BY_FILTER,
    {
      params: filter,
    },
  );
  return response.data;
};

export const createLocation = async (payload: LocationDto): Promise<any> => {
  const response = await axiosClient.post(
    LocationEndpoint.CREATE_LOCATION,
    payload,
  );
  return response.data;
};
