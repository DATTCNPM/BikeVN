export const vehicleModelKeys = {
  all: ["vehicle-models"] as const,
  lists: () => [...vehicleModelKeys.all, "list"] as const,
  list: (page: number, size: number) =>
    [...vehicleModelKeys.lists(), { page, size }] as const,
  details: () => [...vehicleModelKeys.all, "detail"] as const,
  detail: (id: number) => [...vehicleModelKeys.details(), id] as const,
};
