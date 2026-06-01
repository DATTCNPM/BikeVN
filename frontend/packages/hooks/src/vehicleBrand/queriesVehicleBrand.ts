import { useQuery } from "@tanstack/react-query";
import { vehicleBrandPublicApi } from "@repo/api";
import { vehicleBrandKeys } from "../queryKeys";

export const useVehicleBrands = () => {
  return useQuery({
    queryKey: vehicleBrandKeys.list(),
    queryFn: async () => {
      const res = await vehicleBrandPublicApi.getBrands();
      console.log(res);

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
