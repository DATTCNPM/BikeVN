import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleBrandAdminApi } from "@repo/api";

import { vehicleBrandKeys } from "@repo/hooks";
import type { VehicleBrandUpdateRequest } from "@repo/types";

export const useCreateVehicleBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vehicleBrandAdminApi.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vehicleBrandKeys.all,
      });
    },
  });
};

interface UpdatePayload {
  id: number;
  data: VehicleBrandUpdateRequest;
}

export const useUpdateVehicleBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdatePayload) =>
      vehicleBrandAdminApi.update(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vehicleBrandKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: vehicleBrandKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteVehicleBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vehicleBrandAdminApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vehicleBrandKeys.all,
      });
    },
  });
};
