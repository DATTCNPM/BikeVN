import axiosClient from "./axious";
import type { ApiResponse, RoleResponse, RoleRequest } from "@repo/types";

export const roleApi = {
  async getRoles(): Promise<ApiResponse<RoleResponse[]>> {
    return axiosClient.get("/role");
  },

  async createRole(payload: RoleRequest): Promise<ApiResponse<RoleResponse>> {
    return axiosClient.post("/role", payload);
  },

  async deleteRole(roleName: string): Promise<ApiResponse<void>> {
    // Note: backend API deletes by role name (which has bugs, but this is the endpoint structure)
    return axiosClient.delete(`/role/${roleName}`);
  },
};
