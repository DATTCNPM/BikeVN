import axiosAdmin from "../axios/axiosAdmin";
import type { ApiResponse, RoleResponse, RoleRequest } from "@repo/types";

export const roleApi = {
  async getRoles(): Promise<ApiResponse<RoleResponse[]>> {
    return axiosAdmin.get("/role");
  },

  async createRole(payload: RoleRequest): Promise<ApiResponse<RoleResponse>> {
    return axiosAdmin.post("/role", payload);
  },

  async deleteRole(roleName: string): Promise<ApiResponse<void>> {
    // Note: backend API deletes by role name (which has bugs, but this is the endpoint structure)
    return axiosAdmin.delete(`/role/${roleName}`);
  },
};
