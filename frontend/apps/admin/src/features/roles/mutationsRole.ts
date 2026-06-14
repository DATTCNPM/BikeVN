import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleApi } from "@repo/api";
import { roleKeys } from "./roleKeys";
import type { RoleRequest } from "@repo/types";

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RoleRequest) => roleApi.createRole(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleName: string) => roleApi.deleteRole(roleName),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
}
