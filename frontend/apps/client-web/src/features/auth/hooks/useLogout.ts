import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { authClientApi } from "@repo/api";
import { authStorageService } from "@repo/services";
import { authKeys } from "./authKeys";
import { useAuthStore } from "../stores/authStore"; // Thêm dòng này

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setIsLogin = useAuthStore((state) => state.setIsLogin); // Thêm dòng này

  return useMutation({
    mutationFn: async () => {
      const token = authStorageService.getToken();
      if (token) {
        try {
          await authClientApi.logout(token);
        } catch (error) {
          console.error("Logout request failed:", error);
        }
      }
      authStorageService.clearTokens();
    },
    onSuccess: async () => {
      setIsLogin(false); // Cập nhật Zustand về false

      // Xóa cache liên quan đến user profile
      await queryClient.removeQueries({
        queryKey: authKeys.profile(),
      });

      toast.success("Logout successful");
      navigate("/login");
    },
  });
};
