import axiosAdmin from "../axios/axiosAdmin";
import type {
  User,
  Employee,
  AdminEmployeeCreationPayload,
  PaginationResponse,
  AdminUserCreationPayload,
  UpdateEmployeePayload,
  UserQueryParams,
} from "@repo/types";
import { createUserCommonApi } from "../common/createUserCommonApi";

export const userApi = {
  ...createUserCommonApi(axiosAdmin),
  async getUsers({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<PaginationResponse<User>> {
    return axiosAdmin.get<PaginationResponse<User>, PaginationResponse<User>>(
      "/users/customers",
      {
        params: { page, size },
      },
    );
  },

  async getUserById(id: string) {
    return axiosAdmin.get<User>(`/users/${id}`);
  },

  async getEmployees({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<PaginationResponse<Employee>> {
    return axiosAdmin.get<
      PaginationResponse<Employee>,
      PaginationResponse<Employee>
    >("/users/employees", {
      params: { page, size },
    });
  },
  async createEmployee(
    payload: Omit<AdminEmployeeCreationPayload, "passwordHash"> & {
      passwordHash?: string;
    },
  ) {
    const { passwordHash, ...rest } = payload;
    const requestPayload = {
      ...rest,
      passwordHash: passwordHash || "defaultEmployee123",
    };
    return axiosAdmin.post<Employee>("/users/employee", requestPayload);
  },

  async createUser(
    payload: Omit<AdminUserCreationPayload, "passwordHash"> & {
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

  async updateEmployee(
    id: string,
    payload: Partial<UpdateEmployeePayload> & { cccdNumber?: string },
  ) {
    const { cccdNumber, ...rest } = payload;
    const requestPayload = {
      ...rest,
      cccdNumber: cccdNumber || "",
    };
    return axiosAdmin.put<Employee>(`/users/${id}`, requestPayload);
  },

  async deleteUser(id: string) {
    return axiosAdmin.delete(`/users/${id}`);
  },

  // Lấy danh sách xe dựa theo bộ lọc chuyên sâu (Search, Filter, Sort...)
  async getUserFilters(
    params?: UserQueryParams,
  ): Promise<PaginationResponse<User>> {
    // CHÚ Ý: Chỉ truyền 1 tham số Vehicle vào PaginationResponse
    return axiosAdmin.get<PaginationResponse<User>, PaginationResponse<User>>(
      "/users/filter",
      {
        params,
      },
    );
  },
};
