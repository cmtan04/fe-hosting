import axiosClient from "../axiosClient";
import type { GetAllServiceDto } from "../dtos/service.dto";
import { ServiceEndpoint } from "../endpoints/service.endpoint";

export const getAllService = async (): Promise<GetAllServiceDto[]> => {
  const response = await axiosClient.get(
    ServiceEndpoint.GET_ALL_LOCATION_SERVICE,
  );
  return response.data;
};
