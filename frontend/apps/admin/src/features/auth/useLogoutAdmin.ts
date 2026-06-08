import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAdminAuth } from "./useAdminAuth";

export function useLogoutAdmin() {
  const queryClient = useQueryClient();

  const logoutAdmin = useAdminAuth((state) => state.logoutAdmin);

  return useMutation({
    mutationFn: logoutAdmin,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["admin-profile"],
      });
    },
  });
}
