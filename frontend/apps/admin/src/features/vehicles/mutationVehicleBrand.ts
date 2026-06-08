import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleBrandAdminApi } from "@repo/api";

import { vehicleBrandKeys } from "@repo/hooks";
import type {
  VehicleBrandCreationRequest,
  VehicleBrandUpdateRequest,
} from "@repo/types";

export const useCreateVehicleBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VehicleBrandCreationRequest) =>
      vehicleBrandAdminApi.create(data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: vehicleBrandKeys.all,
      });
    },
  });
};

export const useUpdateVehicleBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: VehicleBrandUpdateRequest;
    }) => vehicleBrandAdminApi.update(id, data),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: vehicleBrandKeys.all,
      });

      void queryClient.invalidateQueries({
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
      void queryClient.invalidateQueries({
        queryKey: vehicleBrandKeys.all,
      });
    },
  });
};
