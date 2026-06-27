import { useQuery } from "@tanstack/react-query";
import { authClientApi } from "@repo/api";
import { authStorageService } from "@repo/services";
import { authKeys } from "../auth/authKeys";

export const useProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authClientApi.getProfile, // Viết rút gọn (point-free style)
    enabled: !!authStorageService.getToken(),
    retry: false,
  });
};
