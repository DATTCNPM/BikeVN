import { useQuery } from "@tanstack/react-query";
import { userApi } from "@repo/api";
import { employeeKeys } from "./employeeKeys";
import type {
  PaginationResponse,
  Employee,
  EmployeeQueryParams,
} from "@repo/types";

export function useEmployees(page: number = 1, size: number = 10) {
  return useQuery<PaginationResponse<Employee>>({
    queryKey: employeeKeys.list(page, size),
    queryFn: async () => {
      const response = await userApi.getEmployees({ page, size });
      return response;
    },
  });
}

// Bộ lọc nâng cao (Khớp với API /users/filter)
export function useEmployeeFilters(
  params?: EmployeeQueryParams,
  enabled = true,
) {
  return useQuery<PaginationResponse<Employee>>({
    queryKey: employeeKeys.filter(params),
    queryFn: async () => {
      const response = await userApi.getEmployeeFilters(params);
      return response;
    },
    enabled: !!params && enabled,
  });
}
