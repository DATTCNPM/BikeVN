import axiosAdmin from "../axios/axiosAdmin";

import type { Permission, PermissionRequest } from "@repo/types";

export const permissionApi = {
  async getPermissions(): Promise<Permission[]> {
    return axiosAdmin.get("/permissions");
  },

  async createPermission(payload: PermissionRequest): Promise<Permission> {
    return axiosAdmin.post("/permissions", payload);
  },

  async deletePermission(permissionId: string): Promise<void> {
    await axiosAdmin.delete(`/permissions/${permissionId}`);
  },
};
