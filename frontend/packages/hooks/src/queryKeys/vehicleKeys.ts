import type { VehicleQueryParams } from "@repo/types";
export const vehiclesKeys = {
  all: ["vehicles"] as const,

  list: (page: number, pageSize: number) =>
    ["vehicles", { page, pageSize }] as const,

  filter: (params?: VehicleQueryParams) => ["vehicles", params] as const,

  detail: (id: string) => ["vehicle", id] as const,
};
