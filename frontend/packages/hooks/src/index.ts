import { setServerDownCallback } from "@repo/api";
import { useAuthStore } from "./store/authStore";

setServerDownCallback(() => {
  useAuthStore.getState().setIsServerDown(true);
});

export * from "./queries/queriesVehicle";
export * from "./queries/queriesBranches";
export * from "./queries/queriesVehicleBrand";
export * from "./queries/queriesVehicleModel";
export * from "./queries/queriesVehicleImage";
export * from "./queries/useServerHealthCheck";

export * from "./queryKeys/bookingKeys";
export * from "./queryKeys/branchKeys";
export * from "./queryKeys/vehicleBrandKeys";
export * from "./queryKeys/vehicleImageKeys";
export * from "./queryKeys/vehicleModelKeys";
export * from "./queryKeys/vehicleKeys";
export * from "./queryKeys/paymentKeys";
export * from "./queryKeys/reviewKeys";

export * from "./store/authStore";

export * from "./useGeolocation";
export * from "./useDebounce";
