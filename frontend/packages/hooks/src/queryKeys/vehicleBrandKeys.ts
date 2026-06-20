export const vehicleBrandKeys = {
  all: ["vehicle-brands"] as const,

  lists: () => [...vehicleBrandKeys.all, "list"] as const,

  list: (page: number, size: number) =>
    [...vehicleBrandKeys.lists(), { page, size }] as const,

  details: () => [...vehicleBrandKeys.all, "detail"] as const,

  detail: (id: number) => [...vehicleBrandKeys.details(), id] as const,
};
