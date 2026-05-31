import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleApi } from "@repo/api";
import { vehiclesKeys } from "../queryKeys";

import type {
  Vehicle,
  VehicleCreationRequest,
  VehicleQueryParams,
  VehicleUpdateRequest,
} from "@repo/types";

export function useVehicles(params?: VehicleQueryParams) {
  return useQuery<Vehicle[]>({
    queryKey: vehiclesKeys.list(params),
    queryFn: () => vehicleApi.getVehicles(params),
  });
}

export function useVehicle(id: string) {
  return useQuery<Vehicle>({
    queryKey: vehiclesKeys.detail(id),
    queryFn: () => vehicleApi.getVehicleById(id),
    enabled: !!id,
  });
}

export function useCreateVehicleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VehicleCreationRequest) =>
      vehicleApi.createVehicle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.all });
    },
  });
}

export function useUpdateVehicleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: VehicleUpdateRequest;
    }) => vehicleApi.updateVehicle(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.all });
      queryClient.invalidateQueries({
        queryKey: vehiclesKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteVehicleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleApi.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.all });
    },
  });
}
