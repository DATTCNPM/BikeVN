import { useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionApi } from "@repo/api";
import { permissionKeys } from "./permissionKeys";
import type { PermissionRequest } from "@repo/types";

export function useCreatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PermissionRequest) =>
      permissionApi.createPermission(payload),

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn lỗi trùng tên quyền hạn trên Form tạo mới
    meta: {
      silentErrorCodes: [2003],
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: permissionKeys.all });
    },
  });
}

export function useDeletePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (permissionId: string) =>
      permissionApi.deletePermission(permissionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: permissionKeys.all });
    },
  });
}
