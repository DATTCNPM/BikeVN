import axiosClient from "@/hooks/axiosClient";

import type { User } from "@repo/schemas";

export const authClientApi = {
  async getProfile() {
    return axiosClient.get<User, User>("/users/myInfo");
  },

  async logout(token: string) {
    await axiosClient.post("/auth/logout", {
      token,
    });
  },
};
