import { useQuery } from "@tanstack/react-query";

import { vehicleReturnAdminApi } from "@repo/api";
import { vehicleReturnQueryKeys } from "./vehicleReturnQueryKeys";

export const useVehicleReturnByBookingId = (bookingId: string) => {
  return useQuery({
    queryKey: vehicleReturnQueryKeys.detail(bookingId),

    queryFn: () => vehicleReturnAdminApi.getVehicleReturnByBookingId(bookingId),

    enabled: !!bookingId,
  });
};
