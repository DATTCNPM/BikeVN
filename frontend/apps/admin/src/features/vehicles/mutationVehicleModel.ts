import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleModelAdminApi } from "@repo/api";

import { vehicleModelKeys } from "@repo/hooks";
import type {
  VehicleModelCreationRequest,
  VehicleModelUpdateRequest,
} from "@repo/types";

export const useCreateVehicleModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VehicleModelCreationRequest) =>
      vehicleModelAdminApi.create(data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: vehicleModelKeys.all,
      });
    },
  });
};

interface UpdatePayload {
  id: number;
  data: VehicleModelUpdateRequest;
}

export const useUpdateVehicleModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdatePayload) =>
      vehicleModelAdminApi.update(id, data),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: vehicleModelKeys.all,
      });

      void queryClient.invalidateQueries({
        queryKey: vehicleModelKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteVehicleModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vehicleModelAdminApi.delete(id),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: vehicleModelKeys.all,
      });
    },
  });
};
