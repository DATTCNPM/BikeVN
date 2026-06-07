import axiosAdmin from "../axios/axiosAdmin";
import type {
  User,
  UserCreationRequest,
  UpdateProfilePayload,
} from "@repo/types";

export const userApi = {
  async getUsers() {
    return axiosAdmin.get<User[]>("/user");
  },

  async getUserById(id: string) {
    return axiosAdmin.get<User>(`/user/${id}`);
  },

  async createUser(
    payload: Omit<UserCreationRequest, "passwordHash"> & {
      passwordHash?: string;
      cccdNumber?: string;
    },
  ) {
    const { cccdNumber, passwordHash, ...rest } = payload;
    const requestPayload = {
      ...rest,
      cccdNumber: cccdNumber || undefined,
      passwordHash: passwordHash || "defaultPassword123",
    };
    return axiosAdmin.post<User>("/user", requestPayload);
  },

  async createEmployee(
    payload: Omit<UserCreationRequest, "passwordHash"> & {
      passwordHash?: string;
      cccdNumber?: string;
    },
  ) {
    const { cccdNumber, passwordHash, ...rest } = payload;
    const requestPayload = {
      ...rest,
      cccdNumber: cccdNumber || "",
      passwordHash: passwordHash || "defaultEmployee123",
    };
    return axiosAdmin.post<User>("/user/employee", requestPayload);
  },

  async updateUser(
    id: string,
    payload: Partial<UpdateProfilePayload> & { cccdNumber?: string },
  ) {
    const { cccdNumber, ...rest } = payload;
    const requestPayload = {
      ...rest,
      cccdNumber: cccdNumber || "",
    };
    return axiosAdmin.put<User>(`/user/${id}`, requestPayload);
  },

  async deleteUser(id: string) {
    return axiosAdmin.delete(`/user/${id}`);
  },
};
