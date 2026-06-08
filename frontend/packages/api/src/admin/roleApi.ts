import axiosAdmin from "../axios/axiosAdmin";

import type { Role, RoleRequest } from "@repo/types";

export const roleApi = {
  async getRoles(): Promise<Role[]> {
    return axiosAdmin.get("/role");
  },

  async createRole(payload: RoleRequest): Promise<Role> {
    return axiosAdmin.post("/role", payload);
  },

  async deleteRole(roleName: string): Promise<void> {
    await axiosAdmin.delete(`/role/${roleName}`);
  },
};
