import { useQuery } from "@tanstack/react-query";

import { branchPublicApi } from "@repo/api";
import { branchesKeys } from "../queryKeys";

import type { Branch } from "@repo/types";

export function useBranches() {
  return useQuery<Branch[]>({
    queryKey: branchesKeys.all,
    queryFn: branchPublicApi.getBranches,
  });
}

export function useBranch(id: string) {
  return useQuery<Branch>({
    queryKey: branchesKeys.detail(id),
    queryFn: () => branchPublicApi.getBranchById(id),
    enabled: !!id,
  });
}
