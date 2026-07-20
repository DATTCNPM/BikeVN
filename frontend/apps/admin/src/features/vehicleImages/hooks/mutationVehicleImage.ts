import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleImageAdminApi } from "../api/vehicleImageAdminApi";

import { vehicleImageKeys } from "@repo/hooks";

import type {
  VehicleImageCreatePayload,
  VehicleImageUpdatePayload,
} from "@repo/schemas";

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

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn các mã lỗi liên quan đến Xe không tồn tại và Upload ảnh thất bại trên Form
    meta: {
      silentErrorCodes: [1005, 1012],
    },

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

    // 🌟 Áp dụng tương tự cho nghiệp vụ Update ảnh xe
    meta: {
      silentErrorCodes: [1005, 1012],
    },

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

    // Với nghiệp vụ xóa thường không cần silent error form, nhưng nếu form của bạn có bắt lỗi root
    // thì có thể tùy chọn thêm: meta: { silentErrorCodes: [1005] }

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: vehicleImageKeys.list(variables.vehicleId),
      });
    },
  });
}
