import axiosAdmin from "../axios/axiosAdmin";
import type { User } from "@repo/types";

export const authAdminApi = {
  async getProfile() {
    return axiosAdmin.get<User>("/user/myInfo");
  },

  async logout(token: string) {
    return axiosAdmin.post("/auth/logout", { token });
  },
};
