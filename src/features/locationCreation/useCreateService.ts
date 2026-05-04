import { useMutation } from "@tanstack/react-query";
import { createCustomService } from "../../api/configs/service.config";
import type { ServiceDto } from "../../api/dtos/location.dto";

export const useCreateService = () => {
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      description?: string;
      category?: string;
    }): Promise<ServiceDto> => {
      try {
        return await createCustomService(payload);
      } catch (error) {
        console.error("Failed to create service:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Service creation error:", error);
    },
  });
};
