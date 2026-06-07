import axiosAdmin from "../axios/axiosAdmin";

import type { Permission, PermissionRequest } from "@repo/types";

export const permissionApi = {
  async getPermissions(): Promise<Permission[]> {
    return axiosAdmin.get("/permission");
  },

  async createPermission(payload: PermissionRequest): Promise<Permission> {
    return axiosAdmin.post("/permission", payload);
  },

  async deletePermission(permissionName: string): Promise<void> {
    await axiosAdmin.delete(`/permission/${permissionName}`);
  },
};
