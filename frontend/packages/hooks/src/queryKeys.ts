import { PaymentParams, VehicleQueryParams } from "@repo/types";
export const vehiclesKeys = {
  all: ["vehicles"] as const,

  list: (page: number, pageSize: number) =>
    ["vehicles", { page, pageSize }] as const,

  filter: (params?: VehicleQueryParams) => ["vehicles", params] as const,

  detail: (id: string) => ["vehicle", id] as const,
};

export const bookingsKeys = {
  all: ["bookings"] as const,

  lists: () => [...bookingsKeys.all, "list"] as const,

  list: (page: number, size: number) =>
    [...bookingsKeys.lists(), { page, size }] as const,

  byUser: (userId: string) =>
    [...bookingsKeys.lists(), "user", userId] as const,

  detail: (id: string) => [...bookingsKeys.all, "detail", id] as const,
};

export const paymentsKeys = {
  all: ["payments"] as const,

  list: (params?: PaymentParams) => ["payments", params] as const,

  detail: (id: string) => ["payment", id] as const,

  byBooking: (bookingId: string) => ["payments", "booking", bookingId] as const,
};

export const branchesKeys = {
  all: ["branches"] as const,
  detail: (id: string) => ["branch", id] as const,
};

export const reviewsKeys = {
  all: ["reviews"] as const,
  byVehicle: (vehicleId: string) => ["reviews", "vehicle", vehicleId] as const,
  byUser: (userId: string) => ["reviews", "user", userId] as const,
};

export const vehicleBrandKeys = {
  all: ["vehicle-brands"] as const,

  lists: () => [...vehicleBrandKeys.all, "list"] as const,

  list: (page: number, size: number) =>
    [...vehicleBrandKeys.lists(), { page, size }] as const,

  details: () => [...vehicleBrandKeys.all, "detail"] as const,

  detail: (id: number) => [...vehicleBrandKeys.details(), id] as const,
};

export const vehicleModelKeys = {
  all: ["vehicle-models"] as const,
  lists: () => [...vehicleModelKeys.all, "list"] as const,
  list: (page: number, size: number) =>
    [...vehicleModelKeys.lists(), { page, size }] as const,
  details: () => [...vehicleModelKeys.all, "detail"] as const,
  detail: (id: number) => [...vehicleModelKeys.details(), id] as const,
};

export const vehicleImageKeys = {
  all: ["vehicle-images"] as const,

  list: (vehicleId: string) => [...vehicleImageKeys.all, vehicleId] as const,
};
