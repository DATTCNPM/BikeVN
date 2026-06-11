export const vehicleReturnQueryKeys = {
  all: ["vehicle-return"] as const,

  detail: (bookingId: string) =>
    [...vehicleReturnQueryKeys.all, "detail", bookingId] as const,
};
