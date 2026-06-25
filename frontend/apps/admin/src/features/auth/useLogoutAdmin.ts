import { useQueryClient } from "@tanstack/react-query";

import { usePortalAuth } from "./usePortalAuth";

export function useLogoutAdmin() {
  const queryClient = useQueryClient();

  const logoutPortal = usePortalAuth((state) => state.logoutPortal);

  return () => {
    logoutPortal();

    queryClient.removeQueries({
      queryKey: ["portal-profile"],
    });
  };
}
