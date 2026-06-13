import { useQuery } from "@tanstack/react-query";

import { authAdminApi } from "@repo/api";
import { authStorageService } from "@repo/services";
import { adminAuthKeys } from "./adminAuthKeys";

export function useAdminProfile() {
  const token = authStorageService.getAdminToken();

  return useQuery({
    queryKey: adminAuthKeys.profile(),
    queryFn: authAdminApi.getProfile,

    enabled: !!token,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
