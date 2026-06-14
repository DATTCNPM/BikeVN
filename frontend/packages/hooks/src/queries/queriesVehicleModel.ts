import { useQuery } from "@tanstack/react-query";
import { vehicleModelPublicApi } from "@repo/api";
import { vehicleModelKeys } from "../queryKeys";

import type { VehicleModel, PaginationResponse } from "@repo/types";

export const useVehicleModels = () => {
  return useQuery<PaginationResponse<VehicleModel>>({
    queryKey: vehicleModelKeys.list(),
    queryFn: async () => {
      const res = await vehicleModelPublicApi.getModels();

      return res;
    },
  });
};

export const useVehicleModel = (modelId: number) => {
  return useQuery({
    queryKey: vehicleModelKeys.detail(modelId),

    queryFn: async () => {
      const res = await vehicleModelPublicApi.getModelById(modelId);

      return res;
    },

    enabled: !!modelId,
  });
};
