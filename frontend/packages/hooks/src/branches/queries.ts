import { useQuery } from "@tanstack/react-query";

import { branchPublicApi } from "@repo/api";
import { branchesKeys } from "../queryKeys";

export function useBranches() {
  return useQuery({
    queryKey: branchesKeys.all,
    queryFn: branchPublicApi.getBranches,
  });
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: branchesKeys.detail(id),
    queryFn: () => branchPublicApi.getBranchById(id),
    enabled: !!id,
  });
}
