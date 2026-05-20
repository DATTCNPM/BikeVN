export const vehiclesKeys = {
  all: ["vehicles"] as const,
  detail: (id: string) => ["vehicle", id] as const,
};

export const bookingsKeys = {
  all: ["bookings"] as const,
  detail: (id: string) => ["booking", id] as const,
};

export const paymentsKeys = {
  all: ["payments"] as const,
  detail: (id: string) => ["payment", id] as const,
  byBooking: (bookingId: string) => ["payments", "booking", bookingId] as const,
};

export const branchesKeys = {
  all: ["branches"] as const,
  detail: (id: string) => ["branch", id] as const,
};

export const reviewsKeys = {
  byVehicle: (vehicleId: string) => ["reviews", "vehicle", vehicleId] as const,
  byUser: (userId: string) => ["reviews", "user", userId] as const,
};
