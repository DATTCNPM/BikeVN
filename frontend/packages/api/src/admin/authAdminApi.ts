import axiosAdmin from "../axios/axiosAdmin";
import type { ApiResponse, User } from "@repo/types";

export const authAdminApi = {
  async getProfile(): Promise<ApiResponse<User>> {
    return axiosAdmin.get("/user/myInfo");
  },

  async logout(token: string): Promise<ApiResponse<void>> {
    return axiosAdmin.post("/auth/logout", { token });
  },
};
