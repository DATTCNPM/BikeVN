import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleReturnAdminApi } from "@repo/api";
import { vehicleReturnQueryKeys } from "./vehicleReturnQueryKeys";

export const useCreateVehicleReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vehicleReturnAdminApi.createVehicleReturn,

    onSuccess: ({ vehicleReturn }) => {
      queryClient.setQueryData(
        vehicleReturnQueryKeys.detail(vehicleReturn.bookingId),
        vehicleReturn,
      );
    },
  });
};
