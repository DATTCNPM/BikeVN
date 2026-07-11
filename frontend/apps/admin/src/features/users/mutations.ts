import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@repo/api";
import { usersKeys } from "./usersKeys";
import type {
  UpdateProfilePayload,
  AdminUserCreationPayload,
} from "@repo/types";

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdminUserCreationPayload) =>
      userApi.createUser(payload),

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn lỗi trùng lặp dữ liệu user/email khi tạo
    meta: {
      silentErrorCodes: [1002],
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<UpdateProfilePayload>;
    }) => userApi.updateUser(id, payload),

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn lỗi liên quan đến tài khoản khi cập nhật thông tin
    meta: {
      silentErrorCodes: [1002, 1003, 1004],
    },

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.all });
      await queryClient.invalidateQueries({
        queryKey: usersKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}
