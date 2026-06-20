import { useQuery } from "@tanstack/react-query";

import { reviewAdminApi } from "@repo/api";
import { reviewKeys } from "@repo/hooks";

export const useAdminReviews = ({
  bookingId,
  vehicleId,
  userId,
  rating,
  page,
  size,
}: {
  bookingId?: string;
  vehicleId?: string;
  userId?: string;
  rating?: number;
  page: number;
  size: number;
}) =>
  useQuery({
    queryKey: reviewKeys.adminFilter(
      bookingId,
      vehicleId,
      userId,
      rating,
      page,
      size,
    ),

    queryFn: () =>
      reviewAdminApi.getReviews({
        bookingId,
        vehicleId,
        userId,
        rating,
        page,
        size,
      }),
  });
