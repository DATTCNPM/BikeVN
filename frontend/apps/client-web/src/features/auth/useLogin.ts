import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@repo/api";

import { authStorageService } from "@repo/services";

import { authKeys } from "./authKeys";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await authApi.login(credentials);

      if (response?.code !== 1000 || !response?.result?.token) {
        throw new Error(response?.message || "Sai tài khoản hoặc mật khẩu");
      }

      authStorageService.setToken(response.result.token);

      return response.result;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authKeys.profile(),
      });
    },
  });
};
