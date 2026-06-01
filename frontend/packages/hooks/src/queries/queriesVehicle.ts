import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { vehiclePublicApi } from "@repo/api";
import { vehiclesKeys } from "../queryKeys";

import type { Vehicle, VehicleQueryParams } from "@repo/types";

export function useVehicles(params?: VehicleQueryParams) {
  return useQuery<Vehicle[]>({
    queryKey: vehiclesKeys.list(params),
    queryFn: () => vehiclePublicApi.getVehicles(params),
  });
}

export function useVehicle(id: string) {
  return useQuery<Vehicle>({
    queryKey: vehiclesKeys.detail(id),
    queryFn: () => vehiclePublicApi.getVehicleById(id),
    enabled: !!id,
  });
}
