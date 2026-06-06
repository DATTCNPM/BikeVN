import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleAdminApi } from "@repo/api";

import type { VehicleCreationRequest, VehicleUpdateRequest } from "@repo/types";
import { vehiclesKeys } from "@repo/hooks";

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VehicleCreationRequest) => {
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
      payload: VehicleUpdateRequest;
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
