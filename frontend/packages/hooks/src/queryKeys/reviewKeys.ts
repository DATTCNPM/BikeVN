import type { ReviewQueryParams } from "@repo/schemas";

export const reviewKeys = {
  all: ["reviews"] as const,

  lists: () => [...reviewKeys.all, "list"] as const,

  vehicle: (vehicleId: string, page: number, size: number) =>
    [...reviewKeys.lists(), "vehicle", vehicleId, page, size] as const,

  branch: (branchId: string, page: number, size: number) =>
    [...reviewKeys.lists(), "branch", branchId, page, size] as const,

  // Chỉ cần truyền cụ thể param object vào đây
  publicFilter: (params: ReviewQueryParams) =>
    [...reviewKeys.lists(), "public-filter", params] as const,

  adminFilter: (params: ReviewQueryParams) =>
    [...reviewKeys.lists(), "admin-filter", params] as const,
};
