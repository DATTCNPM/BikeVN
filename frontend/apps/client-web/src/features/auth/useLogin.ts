import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@repo/api";
import { authStorageService } from "@repo/services";

import { authKeys } from "./authKeys";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const auth = await authApi.login(credentials);

      authStorageService.setToken(auth.token);

      return auth;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authKeys.profile(),
      });
    },
  });
};
