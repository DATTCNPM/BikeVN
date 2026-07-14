import { axiosAdmin } from "@repo/api";

import type { Role, RoleRequest } from "@repo/types";

export const roleApi = {
  getRoles() {
    return axiosAdmin.get<Role[], Role[]>("/roles");
  },

  createRole(payload: RoleRequest) {
    return axiosAdmin.post<Role, RoleRequest>("/roles", payload);
  },

  async deleteRole(roleId: string): Promise<void> {
    await axiosAdmin.delete(`/roles/${roleId}`);
  },
};
