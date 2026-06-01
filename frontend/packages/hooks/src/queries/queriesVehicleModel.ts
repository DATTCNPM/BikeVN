import { useQuery } from "@tanstack/react-query";
import { vehicleModelPublicApi } from "@repo/api";
import { vehicleModelKeys } from "../queryKeys";

export const useVehicleModels = () => {
  return useQuery({
    queryKey: vehicleModelKeys.list(),
    queryFn: async () => {
      const res = await vehicleModelPublicApi.getModels();
      console.log(res);

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
