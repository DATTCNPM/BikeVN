import axiosClient from "./axious";
import type { ApiResponse, PermissionResponse, PermissionRequest } from "@repo/types";

export const permissionApi = {
  async getPermissions(): Promise<ApiResponse<PermissionResponse[]>> {
    return axiosClient.get("/permission");
  },

  async createPermission(payload: PermissionRequest): Promise<ApiResponse<PermissionResponse>> {
    return axiosClient.post("/permission", payload);
  },

  async deletePermission(permissionName: string): Promise<ApiResponse<void>> {
    // Note: backend API deletes by name
    return axiosClient.delete(`/permission/${permissionName}`);
  },
};
