import axiosClient from "../axiosClient";
import type { LocationTypeDto } from "../dtos/location.dto";
import { LocationEndpoint } from "../endpoints/location.endpoint";

export const getAllLocationType = async (): Promise<LocationTypeDto[]> => {
  const response = await axiosClient.get(
    LocationEndpoint.GET_ALL_LOCATION_TYPE,
  );
  return response.data;
};
