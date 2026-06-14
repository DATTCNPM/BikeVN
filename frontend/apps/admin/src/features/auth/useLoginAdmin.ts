import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { authApi } from "@repo/api";
import { ROLES } from "@repo/constants";
import { authStorageService, tokenService } from "@repo/services";
import type { LoginPayload } from "@repo/types";

import { useAdminAuth } from "./useAdminAuth";

const hasAdminAccess = (token: string) => {
  const roles = tokenService.getRoles(token);

  return roles.includes(ROLES.ADMIN) || roles.includes(ROLES.EMPLOYEE);
};

export function useLoginAdmin() {
  const navigate = useNavigate();
  const setAdminLogin = useAdminAuth((state) => state.setAdminLogin);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => authApi.login(payload),

    onSuccess: (auth) => {
      const token = auth.token;

      if (!hasAdminAccess(token)) {
        throw new Error("Bạn không có quyền truy cập hệ thống quản trị");
      }

      authStorageService.setAdminToken(token);

      setAdminLogin(true);
      void navigate("/admin");
    },
  });
}
