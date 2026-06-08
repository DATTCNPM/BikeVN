import axiosClient from "../axios/axiosClient";

import type { User } from "@repo/types";

export const authClientApi = {
  async getProfile() {
    return axiosClient.get<User>("/user/myInfo");
  },

  async logout(token: string) {
    await axiosClient.post("/auth/logout", {
      token,
    });
  },
};
