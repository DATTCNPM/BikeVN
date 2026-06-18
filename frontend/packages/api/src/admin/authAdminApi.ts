import axiosAdmin from "../axios/axiosAdmin";
import type { Employee } from "@repo/types";

export const authAdminApi = {
  async getProfile() {
    return axiosAdmin.get<Employee, Employee>("/users/myInfo");
  },

  async logout(token: string) {
    return axiosAdmin.post("/auth/logout", { token });
  },
};
