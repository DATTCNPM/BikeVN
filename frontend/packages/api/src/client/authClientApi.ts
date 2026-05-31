import axiosClient from "../axios/axiosClient";
import type { ApiResponse, User } from "@repo/types";

export const authClientApi = {
  async getProfile(): Promise<ApiResponse<User>> {
    return axiosClient.get("/user/myInfo");
  },

  async logout(token: string): Promise<ApiResponse<void>> {
    return axiosClient.post("/auth/logout", { token });
  },
};
