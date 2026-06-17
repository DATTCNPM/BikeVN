import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { authApi } from "@repo/api";
import { ROLES } from "@repo/constants";
import { authStorageService, tokenService } from "@repo/services";
import type { LoginPayload } from "@repo/types";

import { usePortalAuth } from "./usePortalAuth";

const hasAdminAccess = (token: string) => {
  const roles = tokenService.getRoles(token);

  return roles.includes(ROLES.ADMIN) || roles.includes(ROLES.EMPLOYEE);
};

export function useLoginPortal() {
  const navigate = useNavigate();
  const setPortalLogin = usePortalAuth((state) => state.setPortalLogin);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => authApi.login(payload),

    onSuccess: (auth) => {
      const token = auth.token;

      if (!hasAdminAccess(token)) {
        throw new Error("Bạn không có quyền truy cập hệ thống quản trị");
      }

      authStorageService.setPortalToken(token);

      setPortalLogin(true);

      const roles = tokenService.getRoles(token);

      if (roles.includes(ROLES.ADMIN)) {
        void navigate("/admin");
        return;
      }

      if (roles.includes(ROLES.EMPLOYEE)) {
        void navigate("/employee");
        return;
      }
    },
  });
}
