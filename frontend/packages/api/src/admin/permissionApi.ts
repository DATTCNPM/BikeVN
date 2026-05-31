import axiosAdmin from "../axios/axiosAdmin";
import type {
  ApiResponse,
  PermissionResponse,
  PermissionRequest,
} from "@repo/types";

export const permissionApi = {
  async getPermissions(): Promise<ApiResponse<PermissionResponse[]>> {
    return axiosAdmin.get("/permission");
  },

  async createPermission(
    payload: PermissionRequest,
  ): Promise<ApiResponse<PermissionResponse>> {
    return axiosAdmin.post("/permission", payload);
  },

  async deletePermission(permissionName: string): Promise<ApiResponse<void>> {
    // Note: backend API deletes by name
    return axiosAdmin.delete(`/permission/${permissionName}`);
  },
};
