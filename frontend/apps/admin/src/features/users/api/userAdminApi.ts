import { axiosAdmin } from "@repo/api";
import type {
  User,
  Employee,
  AdminEmployeeCreationPayload,
  PaginationResponse,
  AdminUserCreationPayload,
  UpdateEmployeePayload,
  UserQueryParams,
  EmployeeQueryParams,
} from "@repo/types";
import { createUserCommonApi } from "@repo/api";

export const userApi = {
  ...createUserCommonApi(axiosAdmin),
  getUsers({
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

  getUserById(id: string) {
    return axiosAdmin.get<User>(`/users/${id}`);
  },

  getEmployees({
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
  createEmployee(
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

  createUser(
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

  updateEmployee(
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

  deleteUser(id: string) {
    return axiosAdmin.delete(`/users/${id}`);
  },

  // Lấy danh sách xe dựa theo bộ lọc chuyên sâu (Search, Filter, Sort...)
  getUserFilters(
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

  getEmployeeFilters(
    params?: EmployeeQueryParams,
  ): Promise<PaginationResponse<Employee>> {
    // CHÚ Ý: Chỉ truyền 1 tham số Vehicle vào PaginationResponse
    return axiosAdmin.get<
      PaginationResponse<Employee>,
      PaginationResponse<Employee>
    >("/users/filter", {
      params,
    });
  },
};
