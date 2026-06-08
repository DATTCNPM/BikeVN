import { useMutation } from "@tanstack/react-query";

import { authApi } from "@repo/api";
import type { RegisterPayload } from "@repo/types";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: RegisterPayload) => {
      const response = await authApi.register(userData);

      return response;
    },
  });
};
