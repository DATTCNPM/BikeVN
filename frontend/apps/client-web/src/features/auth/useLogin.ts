import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@repo/api";
import { authStorageService } from "@repo/services";
import { authKeys } from "./authKeys";
import { useAuthStore } from "./authStore";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setIsLogin = useAuthStore((state) => state.setIsLogin);

  return useMutation({
    // 1. mutationFn chỉ lo việc gọi API
    mutationFn: (credentials: { email: string; password: string }) =>
      authApi.login(credentials),

    // 2. onSuccess lo toàn bộ side-effects sau khi có data thành công
    onSuccess: async (auth) => {
      // Lưu token vào storage
      authStorageService.setTokens(auth.token, auth.refreshToken);

      // Cập nhật trạng thái đăng nhập vào Zustand
      setIsLogin(true);

      // Khởi động lại query lấy thông tin profile (vì đã có token mới)
      await queryClient.invalidateQueries({
        queryKey: authKeys.profile(),
      });
    },
  });
};
