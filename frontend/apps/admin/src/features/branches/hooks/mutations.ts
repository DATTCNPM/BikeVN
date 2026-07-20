import { useMutation, useQueryClient } from "@tanstack/react-query";
import { branchAdminApi } from "../api/branchAdminApi";
import { branchesKeys } from "@repo/hooks";
import type { CreateBranchPayload, UpdateBranchPayload } from "@repo/schemas";

export function useCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBranchPayload) => {
      console.log("Creating branch with payload:", payload);
      return branchAdminApi.createBranch(payload);
    },
    // Đăng ký im lặng lỗi 1009 tại đây nếu như global interceptor có bắn Toast tự động
    meta: {
      silentErrorCodes: [1009],
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: branchesKeys.all });
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<UpdateBranchPayload>;
    }) => branchAdminApi.updateBranch(id, payload),
    meta: {
      silentErrorCodes: [1009],
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: branchesKeys.all });
      await queryClient.invalidateQueries({
        queryKey: branchesKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => branchAdminApi.deleteBranch(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: branchesKeys.all });
    },
  });
}
