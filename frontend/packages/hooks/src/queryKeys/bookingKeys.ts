import { BookingFilter } from "@repo/types";

export const bookingsKeys = {
  all: ["bookings"] as const,

  lists: () => [...bookingsKeys.all, "list"] as const,

  list: (page: number, size: number) =>
    [...bookingsKeys.lists(), { page, size }] as const,

  filter: (params?: BookingFilter) =>
    [...bookingsKeys.lists(), "filter", params] as const,

  byUser: (userId: string) =>
    [...bookingsKeys.lists(), "user", userId] as const,

  detail: (id: string) => [...bookingsKeys.all, "detail", id] as const,
};
