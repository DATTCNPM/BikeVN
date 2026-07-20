import { axiosAdmin } from "@/hooks/axiosAdmin";

import type { RoleType, RoleRequest } from "@repo/schemas";

export const roleApi = {
  getRoles() {
    return axiosAdmin.get<RoleType[], RoleType[]>("/roles");
  },

  getRoleById(id: string) {
    return axiosAdmin.get<RoleType, RoleRequest>(`/roles/${id}`);
  },

  createRole(payload: RoleRequest) {
    return axiosAdmin.post<RoleType, RoleType>("/roles", payload);
  },

  async deleteRole(roleId: string): Promise<void> {
    await axiosAdmin.delete(`/roles/${roleId}`);
  },
};
