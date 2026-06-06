import { useMutation } from "@tanstack/react-query";

import { authApi } from "@repo/api";
import type { RegisterPayload } from "@repo/types";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: RegisterPayload) => {
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        cccdNumber: userData.cccdNumber,
      };

      const response = await authApi.register(payload);

      if (response?.code !== 1000) {
        throw new Error(response?.message || "Đăng ký thất bại");
      }

      return response.result;
    },
  });
};
