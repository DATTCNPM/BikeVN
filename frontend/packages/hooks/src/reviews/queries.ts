import { useQuery } from "@tanstack/react-query";

import { reviewApi } from "@repo/api";
import { reviewsKeys } from "../queryKeys";

export function useVehicleReviews(vehicleId: string) {
  return useQuery({
    queryKey: reviewsKeys.byVehicle(vehicleId),
    queryFn: () => reviewApi.getReviewsByVehicle(vehicleId),
    enabled: !!vehicleId,
  });
}

export function useUserReviews(userId: string) {
  return useQuery({
    queryKey: reviewsKeys.byUser(userId),
    queryFn: () => reviewApi.getReviewsByUser(userId),
    enabled: !!userId,
  });
}
