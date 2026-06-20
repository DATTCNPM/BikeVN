import { useQuery } from "@tanstack/react-query";

import { reviewPublicApi } from "@repo/api";
import { reviewKeys } from "@repo/hooks";

export const usePublicReviews = ({
  vehicleId,
  rating,
  page,
  size,
}: {
  vehicleId?: string;
  rating?: number;
  page: number;
  size: number;
}) =>
  useQuery({
    queryKey: reviewKeys.publicFilter(vehicleId, rating, page, size),

    queryFn: () =>
      reviewPublicApi.getPublicReviews({
        vehicleId,
        rating,
        page,
        size,
      }),
  });
