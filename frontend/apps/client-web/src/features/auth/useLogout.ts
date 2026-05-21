import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { authApi } from "@repo/api";

import { authStorageService } from "@repo/services";

import { authKeys } from "./authKeys";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const token = authStorageService.getToken();

      if (token) {
        try {
          await authApi.logout(token);
        } catch (error) {
          console.error("Logout request failed:", error);
        }
      }

      authStorageService.clearToken();
    },

    onSuccess: async () => {
      await queryClient.removeQueries({
        queryKey: authKeys.profile(),
      });
      toast.success("Đăng xuất thành công");
      navigate("/login");
    },
  });
};
