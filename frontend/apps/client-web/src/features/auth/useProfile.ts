import { useQuery } from "@tanstack/react-query";

import { authApi } from "@repo/api";

import { authStorageService } from "@repo/services";

import { authKeys } from "./authKeys";

export const useProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),

    queryFn: async () => {
      //   const response = await authApi.getProfile();
      const response = await authApi.getProfile();
      return response.result;
    },

    enabled: !!authStorageService.getToken(),

    retry: false,
  });
};
