import { useQuery } from "@tanstack/react-query";

import { vehiclePublicApi } from "@repo/api";
import { vehiclesKeys } from "../queryKeys/vehicleKeys";

import type {
  Vehicle,
  VehicleQueryParams,
  PaginationResponse,
} from "@repo/types";

export function useVehicles(page: number, size: number) {
  return useQuery<PaginationResponse<Vehicle>>({
    queryKey: vehiclesKeys.list(page, size),
    queryFn: async () => {
      const res = await vehiclePublicApi.getVehicles(page, size);
      console.log("vehicles data ", res);
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

export function useVehicleFilters(params?: VehicleQueryParams, enabled = true) {
  return useQuery<PaginationResponse<Vehicle>>({
    queryKey: vehiclesKeys.filter(params),
    queryFn: async () => {
      const res = await vehiclePublicApi.getVehicleFilters(params);
      return res;
    },
    enabled: !!params && enabled,
  });
}
