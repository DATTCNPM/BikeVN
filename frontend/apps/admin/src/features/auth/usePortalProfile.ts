import { useQuery } from "@tanstack/react-query";

import { authAdminApi } from "@repo/api";
import { authStorageService } from "@repo/services";
import { portalAuthKeys } from "./portalAuthKeys";

export function usePortalProfile() {
  const token = authStorageService.getPortalToken();

  return useQuery({
    queryKey: portalAuthKeys.profile(),
    queryFn: () => authAdminApi.getProfile(),

    enabled: !!token,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
