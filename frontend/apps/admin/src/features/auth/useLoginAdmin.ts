import { useMutation } from "@tanstack/react-query";

import { authApi } from "@repo/api";
import { ROLES } from "@repo/constants";
import { authStorageService, tokenService } from "@repo/services";

import { useAdminAuth } from "./useAdminAuth";

const hasAdminAccess = (token: string) => {
  const roles = tokenService.getRoles(token);

  return roles.includes(ROLES.ADMIN) || roles.includes(ROLES.EMPLOYEE);
};

export function useLoginAdmin() {
  const setAdminLogin = useAdminAuth((state) => state.setAdminLogin);

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: (auth) => {
      const token = auth.token;

      if (!hasAdminAccess(token)) {
        throw new Error("Bạn không có quyền truy cập hệ thống quản trị");
      }

      authStorageService.setAdminToken(token);

      setAdminLogin(true);
    },
  });
}
