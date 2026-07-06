import { useQuery } from "@tanstack/react-query";
import { authClientApi } from "@repo/api";
import { authKeys } from "../auth/authKeys";
import { useAuthStore } from "../auth/authStore";

export const useProfile = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authClientApi.getProfile, // Viết rút gọn (point-free style)
    enabled: isLogin,
    retry: false,
  });
};
