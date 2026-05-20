import axiosClient from "./axious";
import type { ApiResponse, User, UserCreationRequest, UpdateProfilePayload } from "@repo/types";

export const userApi = {
  async getUsers(): Promise<ApiResponse<User[]>> {
    return axiosClient.get("/user");
  },

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return axiosClient.get(`/user/${id}`);
  },

  async createUser(
    payload: Omit<UserCreationRequest, "passwordHash"> & { passwordHash?: string; cccd_number?: string }
  ): Promise<ApiResponse<User>> {
    const { cccd_number, passwordHash, ...rest } = payload;
    const requestPayload = {
      ...rest,
      cccdNumber: cccd_number || (payload as any).cccdNumber,
      passwordHash: passwordHash || "defaultPassword123",
    };
    return axiosClient.post("/user", requestPayload);
  },

  async updateUser(id: string, payload: Partial<UpdateProfilePayload> & { cccd_number?: string }): Promise<ApiResponse<User>> {
    const { cccd_number, ...rest } = payload;
    const requestPayload = {
      ...rest,
      cccdNumber: cccd_number !== undefined ? cccd_number : (payload as any).cccdNumber,
    };
    return axiosClient.put(`/user/${id}`, requestPayload);
  },

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return axiosClient.delete(`/user/${id}`);
  },
};
