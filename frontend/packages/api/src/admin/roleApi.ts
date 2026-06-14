import axiosAdmin from "../axios/axiosAdmin";

import type { Role, RoleRequest } from "@repo/types";

export const roleApi = {
  async getRoles() {
    return axiosAdmin.get<Role[], Role[]>("/roles");
  },

  async createRole(payload: RoleRequest) {
    return axiosAdmin.post<Role, RoleRequest>("/roles", payload);
  },

  async deleteRole(roleId: string): Promise<void> {
    await axiosAdmin.delete(`/roles/${roleId}`);
  },
};
