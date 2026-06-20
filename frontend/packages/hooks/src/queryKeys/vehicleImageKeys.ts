export const vehicleImageKeys = {
  all: ["vehicle-images"] as const,

  list: (vehicleId: string) => [...vehicleImageKeys.all, vehicleId] as const,
};
