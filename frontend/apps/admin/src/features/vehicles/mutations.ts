import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  vehicleApi,
  type CreateVehiclePayload,
  type UpdateVehiclePayload,
} from "@repo/api";
import { vehiclesKeys } from "@repo/hooks";

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVehiclePayload) =>
      vehicleApi.createVehicle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.all });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateVehiclePayload;
    }) => vehicleApi.updateVehicle(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.all });
      queryClient.invalidateQueries({
        queryKey: vehiclesKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleApi.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.all });
    },
  });
}
