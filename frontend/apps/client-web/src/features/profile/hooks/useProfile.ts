import { useQuery } from "@tanstack/react-query";
import { authClientApi } from "@repo/api";
import { authKeys } from "@/features/auth/hooks/authKeys";
import { useAuthStore } from "@/features/auth/stores/authStore";

export const useProfile = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authClientApi.getProfile, // Viết rút gọn (point-free style)
    enabled: isLogin,
    retry: false,
  });
};
