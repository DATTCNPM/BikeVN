import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleApi } from "../api/roleApi";
import { roleKeys } from "./roleKeys";
import type { RoleRequest } from "@repo/types";

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RoleRequest) => roleApi.createRole(payload),

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn lỗi trùng tên vai trò trên Form tạo mới
    meta: {
      silentErrorCodes: [2002],
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleId: string) => roleApi.deleteRole(roleId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
}
