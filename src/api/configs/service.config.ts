import axiosClient from "../axiosClient";
import type { GetAllServiceDto } from "../dtos/service.dto";
import type { ServiceDto } from "../dtos/location.dto";
import { ServiceEndpoint } from "../endpoints/service.endpoint";

export const getAllService = async (): Promise<GetAllServiceDto[]> => {
  const response = await axiosClient.get(
    ServiceEndpoint.GET_ALL_LOCATION_SERVICE,
  );
  return response.data;
};

export const createCustomService = async (payload: {
  name: string;
  description?: string;
  category?: string;
}): Promise<ServiceDto> => {
  const response = await axiosClient.post(
    ServiceEndpoint.CREATE_LOCATION_SERVICE,
    payload,
  );
  return response.data.data;
};
