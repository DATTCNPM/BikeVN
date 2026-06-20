export const reviewKeys = {
  all: ["reviews"] as const,

  lists: () => [...reviewKeys.all, "list"] as const,

  vehicle: (vehicleId: string, page: number, size: number) =>
    [...reviewKeys.lists(), "vehicle", vehicleId, page, size] as const,

  branch: (branchId: string, page: number, size: number) =>
    [...reviewKeys.lists(), "branch", branchId, page, size] as const,

  publicFilter: (
    vehicleId: string | undefined,
    rating: number | undefined,
    page: number,
    size: number,
  ) =>
    [
      ...reviewKeys.lists(),
      "public-filter",
      {
        vehicleId,
        rating,
        page,
        size,
      },
    ] as const,

  adminFilter: (
    bookingId: string | undefined,
    vehicleId: string | undefined,
    userId: string | undefined,
    rating: number | undefined,
    page: number,
    size: number,
  ) =>
    [
      ...reviewKeys.lists(),
      "admin-filter",
      {
        bookingId,
        vehicleId,
        userId,
        rating,
        page,
        size,
      },
    ] as const,
};
