import { axiosAdmin } from "@repo/api";

import type { Permission, PermissionRequest } from "@repo/types";

export const permissionApi = {
  getPermissions(): Promise<Permission[]> {
    return axiosAdmin.get("/permissions");
  },

  createPermission(payload: PermissionRequest): Promise<Permission> {
    return axiosAdmin.post("/permissions", payload);
  },

  async deletePermission(permissionId: string): Promise<void> {
    await axiosAdmin.delete(`/permissions/${permissionId}`);
  },
};
