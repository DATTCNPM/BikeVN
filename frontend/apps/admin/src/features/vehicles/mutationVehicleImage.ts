import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleImageAdminApi } from "@repo/api";

import { vehicleImageKeys } from "@repo/hooks";

export function useUploadVehicleImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vehicleId,
      payload,
    }: {
      vehicleId: string;

      payload: any;
    }) => vehicleImageAdminApi.uploadImage(vehicleId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
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

      payload: any;
    }) => vehicleImageAdminApi.updateImage(vehicleId, imageId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
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
      queryClient.invalidateQueries({
        queryKey: vehicleImageKeys.list(variables.vehicleId),
      });
    },
  });
}
