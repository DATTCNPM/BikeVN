import { useQuery } from "@tanstack/react-query";

import { reviewPublicApi } from "@repo/api";
import { reviewKeys } from "@repo/hooks";

export const useVehicleReviews = ({
  vehicleId,
  page,
  size,
}: {
  vehicleId: string;
  page: number;
  size: number;
}) =>
  useQuery({
    queryKey: reviewKeys.vehicle(vehicleId, page, size),

    queryFn: () =>
      reviewPublicApi.getVehicleReviews({
        vehicleId,
        page,
        size,
      }),
  });
