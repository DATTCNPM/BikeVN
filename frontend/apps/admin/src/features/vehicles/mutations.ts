import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleAdminApi } from "@repo/api";

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
      return vehicleAdminApi.createVehicle(payload);
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
      return vehicleAdminApi.updateVehicle(id, payload);
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
    mutationFn: (id: string) => vehicleAdminApi.deleteVehicle(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: vehiclesKeys.all });
    },
  });
}
