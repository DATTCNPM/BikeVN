import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@repo/api";
import { employeeKeys } from "./employeeKeys";
import type {
  UpdateEmployeePayload,
  AdminEmployeeCreationPayload,
} from "@repo/types";

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<AdminEmployeeCreationPayload, "passwordHash">) =>
      userApi.createEmployee(payload),
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
    }) => userApi.updateEmployee(id, payload),
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
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
}
