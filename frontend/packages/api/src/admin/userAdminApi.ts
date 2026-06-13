import axiosAdmin from "../axios/axiosAdmin";
import type {
  User,
  UserCreationRequest,
  UpdateProfilePayload,
} from "@repo/types";

export const userApi = {
  async getUsers({ page, size }: { page: number; size: number }) {
    return axiosAdmin.get<User[], User[]>("/users", { params: { page, size } });
  },

  async getUserById(id: string) {
    return axiosAdmin.get<User>(`/users/${id}`);
  },

  async createEmployee(
    payload: Omit<UserCreationRequest, "passwordHash"> & {
      passwordHash?: string;
    },
  ) {
    const { passwordHash, ...rest } = payload;
    const requestPayload = {
      ...rest,
      passwordHash: passwordHash || "defaultEmployee123",
    };
    return axiosAdmin.post<User>("/users/employee", requestPayload);
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
    return axiosAdmin.post<User>("/users", requestPayload);
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
    return axiosAdmin.put<User>(`/users/${id}`, requestPayload);
  },

  async deleteUser(id: string) {
    return axiosAdmin.delete(`/users/${id}`);
  },
};
