import { useMutation, useQueryClient } from "@tanstack/react-query";
import { branchAdminApi } from "@repo/api";
import { branchesKeys } from "@repo/hooks";
import type { CreateBranchPayload, UpdateBranchPayload } from "@repo/types";

export function useCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBranchPayload) => {
      console.log("Creating branch with payload:", payload);
      return branchAdminApi.createBranch(payload);
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
