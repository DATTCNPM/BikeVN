import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@repo/api";
import { authStorageService } from "@repo/services";
import { authKeys } from "./authKeys";
import { useAuthStore } from "./authStore"; // Thêm dòng này

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setIsLogin = useAuthStore((state) => state.setIsLogin); // Thêm dòng này

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const auth = await authApi.login(credentials);
      authStorageService.setToken(auth.token);
      return auth;
    },
    onSuccess: async () => {
      setIsLogin(true); // Cập nhật Zustand ngay khi login thành công
      await queryClient.invalidateQueries({
        queryKey: authKeys.profile(),
      });
    },
  });
};
