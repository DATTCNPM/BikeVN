import axiosClient from "./axious";
import type {
  ApiResponse,
  User,
  UserCreationRequest,
  UpdateProfilePayload,
} from "@repo/types";

export const userApi = {
  async getUsers(): Promise<ApiResponse<User[]>> {
    return axiosClient.get("/user");
  },

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return axiosClient.get(`/user/${id}`);
  },

  async createUser(
    payload: Omit<UserCreationRequest, "passwordHash"> & {
      passwordHash?: string;
      cccdNumber?: string;
    },
  ): Promise<ApiResponse<User>> {
    const { cccdNumber, passwordHash, ...rest } = payload;
    const requestPayload = {
      ...rest,
      cccdNumber: cccdNumber || undefined,
      passwordHash: passwordHash || "defaultPassword123",
    };
    return axiosClient.post("/user", requestPayload);
  },

  async createEmployee(
    payload: Omit<UserCreationRequest, "passwordHash"> & {
      passwordHash?: string;
      cccdNumber?: string;
    },
  ): Promise<ApiResponse<User>> {
    const { cccdNumber, passwordHash, ...rest } = payload;
    const requestPayload = {
      ...rest,
      cccdNumber: cccdNumber || "",
      passwordHash: passwordHash || "defaultEmployee123",
    };
    return axiosClient.post("/user/employee", requestPayload);
  },

  async updateUser(
    id: string,
    payload: Partial<UpdateProfilePayload> & { cccdNumber?: string },
  ): Promise<ApiResponse<User>> {
    const { cccdNumber, ...rest } = payload;
    const requestPayload = {
      ...rest,
      cccdNumber: cccdNumber || "",
    };
    return axiosClient.put(`/user/${id}`, requestPayload);
  },

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return axiosClient.delete(`/user/${id}`);
  },
};
