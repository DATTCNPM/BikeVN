import { useQuery } from "@tanstack/react-query";

import { authApi, userApi } from "@repo/api";

import { authStorageService } from "@repo/services";

import { authKeys } from "./authKeys";

import { jwtDecode } from "jwt-decode";

export const useProfile = () => {
  const token = authStorageService.getToken();
  // Sau khi có token từ login:
  const decoded = jwtDecode<{ sub: string; jti: string }>(token || "");
  // Thử dùng decoded.jti hoặc decoded.sub tùy theo Backend quy định để truyền vào API getUser
  const userId = decoded.jti;
  return useQuery({
    queryKey: authKeys.profile(),

    queryFn: async () => {
      //   const response = await authApi.getProfile();
      const response = await userApi.getUserById(userId);
      return response.result;
    },

    enabled: !!authStorageService.getToken(),

    retry: false,
  });
};
