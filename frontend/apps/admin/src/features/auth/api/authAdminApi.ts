import { axiosAdmin } from "@repo/api";
import type { Employee } from "@repo/types";

export const authAdminApi = {
  getProfile() {
    return axiosAdmin.get<Employee, Employee>("/users/myInfo");
  },

  logout(token: string) {
    return axiosAdmin.post("/auth/logout", { token });
  },
};
