import { useQuery } from "@tanstack/react-query";

import { vehiclePublicApi } from "@repo/api";
import { vehiclesKeys } from "../queryKeys";

import type {
  Vehicle,
  VehicleQueryParams,
  PaginationResponse,
} from "@repo/types";

export function useVehicles(params?: VehicleQueryParams) {
  return useQuery<PaginationResponse<Vehicle>>({
    queryKey: vehiclesKeys.list(params),
    queryFn: async () => {
      const res = await vehiclePublicApi.getVehicles(params);
      return res;
    },
  });
}

export function useVehicle(id: string) {
  return useQuery<Vehicle>({
    queryKey: vehiclesKeys.detail(id),
    queryFn: async () => {
      const res = await vehiclePublicApi.getVehicleById(id);
      return res;
    },
    enabled: !!id,
  });
}
