import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleBrandAdminApi } from "../api/vehicleBrandAdminApi";

import { vehicleBrandKeys } from "@repo/hooks";
import type {
  VehicleBrandCreationRequest,
  VehicleBrandUpdateRequest,
} from "@repo/schemas";

export const useCreateVehicleBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VehicleBrandCreationRequest) =>
      vehicleBrandAdminApi.create(data),

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn mã lỗi trùng tên hãng xe khi tạo mới
    meta: {
      silentErrorCodes: [1011],
    },

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

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn mã lỗi không tồn tại hoặc trùng tên khi chỉnh sửa hãng xe
    meta: {
      silentErrorCodes: [1006, 1011],
    },

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
