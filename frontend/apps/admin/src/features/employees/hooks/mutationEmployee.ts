import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../api/employeeAdminApi";
import { employeeKeys } from "./employeeKeys";
import type {
  UpdateEmployeePayload,
  AdminEmployeeCreationPayload,
} from "@repo/types";

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<AdminEmployeeCreationPayload, "passwordHash">) =>
      employeeApi.createEmployee(payload),

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn lỗi trùng lặp email/tài khoản nhân viên khi tạo mới
    meta: {
      silentErrorCodes: [1002],
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<UpdateEmployeePayload>;
    }) => employeeApi.updateEmployee(id, payload),

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn lỗi không tìm thấy tài khoản hoặc trùng email khi cập nhật thông tin
    meta: {
      silentErrorCodes: [1002, 1003],
    },

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      await queryClient.invalidateQueries({
        queryKey: employeeKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeeApi.deleteUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
}
