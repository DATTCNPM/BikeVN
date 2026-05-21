import { useMutation } from "@tanstack/react-query";

import { authApi } from "@repo/api";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  cccdNumber?: string;
}

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: RegisterPayload) => {
      const payload = {
        name: userData.name,
        email: userData.email,
        passwordHash: userData.password,
        phone: userData.phone || undefined,
        cccdNumber: userData.cccdNumber || undefined,
      };

      const response = await authApi.register(payload);

      if (response?.code !== 1000) {
        throw new Error(response?.message || "Đăng ký thất bại");
      }

      return response.result;
    },
  });
};
