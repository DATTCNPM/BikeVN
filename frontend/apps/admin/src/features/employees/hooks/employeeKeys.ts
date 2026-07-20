import type { EmployeeQueryParams } from "@repo/schemas";
export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (page: number, size: number) =>
    [...employeeKeys.lists(), { page, size }] as const,
  filters: () => [...employeeKeys.all, "filter"] as const,
  filter: (params?: EmployeeQueryParams) =>
    [...employeeKeys.filters(), { params }] as const,

  detail: (id: string) => [...employeeKeys.all, "detail", id] as const,
};
