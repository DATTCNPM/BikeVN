import { useQuery } from "@tanstack/react-query";

import { vehicleApi } from "@repo/api";
import { vehiclesKeys } from "../queryKeys";

import type { Vehicle } from "@repo/types";

export function useVehicles() {
  return useQuery<Vehicle[]>({
    queryKey: vehiclesKeys.all,
    queryFn: vehicleApi.getVehicles,
  });
}

export function useVehicle(id: string) {
  return useQuery<Vehicle>({
    queryKey: vehiclesKeys.detail(id),
    queryFn: () => vehicleApi.getVehicleById(id),
    enabled: !!id,
  });
}
