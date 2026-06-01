import { useQuery } from "@tanstack/react-query";

import { vehicleImagePublicApi } from "@repo/api";

import { vehicleImageKeys } from "../queryKeys";

export function useVehicleImages(vehicleId: string) {
  return useQuery({
    queryKey: vehicleImageKeys.list(vehicleId),

    queryFn: () => vehicleImagePublicApi.getImages(vehicleId),

    enabled: !!vehicleId,
  });
}
