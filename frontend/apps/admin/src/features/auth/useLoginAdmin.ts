import { useMutation } from "@tanstack/react-query";

import { useAdminAuth } from "./useAdminAuth";

export function useLoginAdmin() {
  const loginAdmin = useAdminAuth((state) => state.loginAdmin);

  return useMutation({
    mutationFn: loginAdmin,
  });
}
