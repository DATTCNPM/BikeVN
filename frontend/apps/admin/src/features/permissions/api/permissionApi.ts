import { axiosAdmin } from "@/hooks/axiosAdmin";

import type { PermissionType, PermissionRequest } from "@repo/schemas";

export const permissionApi = {
  getPermissions(): Promise<PermissionType[]> {
    return axiosAdmin.get("/permissions");
  },

  createPermission(payload: PermissionRequest): Promise<PermissionType> {
    return axiosAdmin.post("/permissions", payload);
  },

  async deletePermission(permissionId: string): Promise<void> {
    await axiosAdmin.delete(`/permissions/${permissionId}`);
  },
};
