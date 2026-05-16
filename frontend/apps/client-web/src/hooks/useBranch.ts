import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  branchApi,
  type CreateBranchPayload,
  type UpdateBranchPayload,
} from "@/api/branchApi";

export function useBranches() {
  return useQuery({
    queryKey: ["branches"],
    queryFn: branchApi.getBranches,
  });
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: ["branch", id],
    queryFn: () => branchApi.getBranchById(id),

    enabled: !!id,
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBranchPayload) =>
      branchApi.createBranch(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["branches"],
      });
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
      payload: UpdateBranchPayload;
    }) => branchApi.updateBranch(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["branches"],
      });

      queryClient.invalidateQueries({
        queryKey: ["branch", variables.id],
      });
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => branchApi.deleteBranch(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["branches"],
      });
    },
  });
}
