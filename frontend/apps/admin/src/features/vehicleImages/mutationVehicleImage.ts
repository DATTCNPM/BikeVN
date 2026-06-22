import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleImageAdminApi } from "@repo/api";

import { vehicleImageKeys } from "@repo/hooks";

import type {
  VehicleImageCreatePayload,
  VehicleImageUpdatePayload,
} from "@repo/types";

export function useUploadVehicleImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vehicleId,
      payload,
    }: {
      vehicleId: string;

      payload: VehicleImageCreatePayload;
    }) => vehicleImageAdminApi.uploadImage(vehicleId, payload),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: vehicleImageKeys.list(variables.vehicleId),
      });
    },
  });
}

export function useUpdateVehicleImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vehicleId,
      imageId,
      payload,
    }: {
      vehicleId: string;

      imageId: string;

      payload: VehicleImageUpdatePayload;
    }) => vehicleImageAdminApi.editImage(vehicleId, imageId, payload),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: vehicleImageKeys.list(variables.vehicleId),
      });
    },
  });
}

export function useDeleteVehicleImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vehicleId,
      imageId,
    }: {
      vehicleId: string;

      imageId: string;
    }) => vehicleImageAdminApi.deleteImage(vehicleId, imageId),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: vehicleImageKeys.list(variables.vehicleId),
      });
    },
  });
}
