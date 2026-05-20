import { useQuery } from "@tanstack/react-query";

import { branchApi } from "@repo/api";
import { branchesKeys } from "../queryKeys";

export function useBranches() {
  return useQuery({
    queryKey: branchesKeys.all,
    queryFn: branchApi.getBranches,
  });
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: branchesKeys.detail(id),
    queryFn: () => branchApi.getBranchById(id),
    enabled: !!id,
  });
}
