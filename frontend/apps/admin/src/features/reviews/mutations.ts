import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@repo/api";
import type { ReviewSchema } from "@repo/schemas";
import { reviewsKeys } from "@repo/hooks";

export function useUpdateReviewAdmin(
  reviewId: string,
  vehicleId?: string,
  userId?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewSchema) =>
      reviewApi.updateReview(reviewId, payload),
    onSuccess: () => {
      if (vehicleId)
        queryClient.invalidateQueries({
          queryKey: reviewsKeys.byVehicle(vehicleId),
        });
      if (userId)
        queryClient.invalidateQueries({ queryKey: reviewsKeys.byUser(userId) });
    },
  });
}

export function useDeleteReviewAdmin(vehicleId?: string, userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewApi.deleteReview(id),
    onSuccess: () => {
      if (vehicleId)
        queryClient.invalidateQueries({
          queryKey: reviewsKeys.byVehicle(vehicleId),
        });
      if (userId)
        queryClient.invalidateQueries({ queryKey: reviewsKeys.byUser(userId) });
    },
  });
}
