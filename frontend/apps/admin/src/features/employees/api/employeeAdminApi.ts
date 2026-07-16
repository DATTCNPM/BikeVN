import { axiosAdmin } from "@/hooks/axiosAdmin";
import type {
  Employee,
  AdminEmployeeCreationPayload,
  PaginationResponse,
  UpdateEmployeePayload,
  EmployeeQueryParams,
} from "@repo/types";

export const employeeApi = {
  getEmployeeById(id: string) {
    return axiosAdmin.get<Employee>(`/users/${id}`);
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
