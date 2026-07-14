import type { VehicleReturnFilterParams } from "@repo/types";

export const vehicleReturnQueryKeys = {
  all: ["vehicle-return"] as const,

  // Chi tiết biên bản theo bookingId
  details: () => [...vehicleReturnQueryKeys.all, "detail"] as const,
  detail: (bookingId: string) =>
    [...vehicleReturnQueryKeys.details(), bookingId] as const,

  // Danh sách tổng (Admin)
  lists: () => [...vehicleReturnQueryKeys.all, "list"] as const,
  list: (page: number, size: number) =>
    [...vehicleReturnQueryKeys.lists(), { page, size }] as const,

  // Danh sách theo chi nhánh (Employee)
  branchLists: () => [...vehicleReturnQueryKeys.all, "branch-list"] as const,
  branchList: (page: number, size: number) =>
    [...vehicleReturnQueryKeys.branchLists(), { page, size }] as const,

  // Danh sách bộ lọc nâng cao
  filters: () => [...vehicleReturnQueryKeys.all, "filter"] as const,
  filter: (params: VehicleReturnFilterParams) =>
    [...vehicleReturnQueryKeys.filters(), params] as const,
};
