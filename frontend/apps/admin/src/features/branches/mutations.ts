import { useMutation, useQueryClient } from "@tanstack/react-query";
import { branchApi, type CreateBranchPayload } from "@repo/api";
import { branchesKeys } from "@repo/hooks";

export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBranchPayload) =>
      branchApi.createBranch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.all });
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
      payload: CreateBranchPayload;
    }) => branchApi.updateBranch(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.all });
      queryClient.invalidateQueries({
        queryKey: branchesKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => branchApi.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.all });
    },
  });
}
