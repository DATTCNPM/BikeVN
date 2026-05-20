import { useMutation, useQueryClient } from "@tanstack/react-query";
import { branchApi } from "@repo/api";
import { branchesKeys } from "@repo/hooks";
import { type BranchFormValues } from "./schemas";

export function useCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BranchFormValues) => branchApi.createBranch(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: branchesKeys.all });
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<BranchFormValues> }) => 
      branchApi.updateBranch(id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: branchesKeys.all });
      await queryClient.invalidateQueries({ queryKey: branchesKeys.detail(variables.id) });
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => branchApi.deleteBranch(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: branchesKeys.all });
    },
  });
}
