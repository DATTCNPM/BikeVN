import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  vehicleApi,
  type CreateVehiclePayload,
  type UpdateVehiclePayload,
} from "@/api/vehicleApi";

export function useVehicles() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: vehicleApi.getVehicles,
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => vehicleApi.getVehicleById(id),
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVehiclePayload) =>
      vehicleApi.createVehicle(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });

      queryClient.invalidateQueries({
        queryKey: ["vehicle", variables.id],
      });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleApi.deleteVehicle(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });
    },
  });
}
