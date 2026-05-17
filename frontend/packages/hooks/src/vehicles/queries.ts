import { useQuery } from "@tanstack/react-query";

import { vehicleApi } from "@repo/api";
import { vehiclesKeys } from "../queryKeys";

export function useVehicles() {
  return useQuery({
    queryKey: vehiclesKeys.all,
    queryFn: vehicleApi.getVehicles,
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: vehiclesKeys.detail(id),
    queryFn: () => vehicleApi.getVehicleById(id),
    enabled: !!id,
  });
}
