import { useQuery } from "@tanstack/react-query";
import { vehicleBrandPublicApi } from "@repo/api";
import { vehicleBrandKeys } from "../queryKeys";

import type { VehicleBrand, PaginationResponse } from "@repo/types";

export const useVehicleBrands = (page: number = 1, size: number = 10) => {
  return useQuery<PaginationResponse<VehicleBrand>>({
    queryKey: vehicleBrandKeys.list(page, size),
    queryFn: async () => {
      const res = await vehicleBrandPublicApi.getBrands(page, size);

      return res;
    },
  });
};

export const useVehicleBrand = (brandId: number) => {
  return useQuery({
    queryKey: vehicleBrandKeys.detail(brandId),

    queryFn: async () => {
      const res = await vehicleBrandPublicApi.getBrandById(brandId);

      return res;
    },

    enabled: !!brandId,
  });
};
