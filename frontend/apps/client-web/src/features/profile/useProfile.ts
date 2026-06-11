import { useQuery } from "@tanstack/react-query";

import { authClientApi } from "@repo/api";

import { authStorageService } from "@repo/services";

import { authKeys } from "../auth/authKeys";

export const useProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),

    queryFn: async () => {
      //   const response = await authApi.getProfile();
      const response = await authClientApi.getProfile();
      return response;
    },

    enabled: !!authStorageService.getToken(),

    retry: false,
  });
};
