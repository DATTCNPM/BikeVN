import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleApi } from "@repo/api";

import type {
  VehicleCreationFormValues,
  VehicleUpdateFormValues,
} from "@repo/schemas";
import { vehiclesKeys } from "@repo/hooks";

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VehicleCreationFormValues) => {
      console.log("Creating vehicle with payload:", payload);
      return vehicleApi.createVehicle(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: vehiclesKeys.all });
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
      payload: VehicleUpdateFormValues;
    }) => {
      console.log("Updating vehicle with id:", id, "and payload:", payload);
      return vehicleApi.updateVehicle(id, payload);
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: vehiclesKeys.all });
      await queryClient.invalidateQueries({
        queryKey: vehiclesKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleApi.deleteVehicle(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: vehiclesKeys.all });
    },
  });
}
