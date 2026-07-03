// useVehicleModels.ts
import { useQuery } from "@tanstack/react-query";
import { vehicleModelPublicApi } from "@repo/api";

import { vehicleModelKeys } from "../queryKeys/vehicleModelKeys";
import type {
  VehicleModel,
  PaginationResponse,
  VehicleModelQueryParams,
} from "@repo/types";

export const useVehicleModels = (page: number = 1, size: number = 10) => {
  return useQuery<PaginationResponse<VehicleModel>>({
    queryKey: vehicleModelKeys.list(page, size),
    queryFn: async () => {
      const res = await vehicleModelPublicApi.getModels(page, size);
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

// HOOK MỚI: Dành riêng cho tác vụ filter dữ liệu nâng cao
export const useVehicleModelFilters = (
  params: VehicleModelQueryParams,
  enabled: boolean,
) => {
  return useQuery<PaginationResponse<VehicleModel>>({
    queryKey: vehicleModelKeys.filter(params),
    queryFn: () => vehicleModelPublicApi.filterModels(params),
    enabled: enabled,
  });
};
