import { useQuery } from "@tanstack/react-query";

import { authAdminApi } from "@repo/api";
import { authStorageService } from "@repo/services";

export const adminAuthKeys = {
  profile: () => ["admin-profile"] as const,
};

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
