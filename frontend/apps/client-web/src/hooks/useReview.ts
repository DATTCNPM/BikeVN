import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { reviewApi } from "@repo/api";

import type { ReviewSchema } from "@repo/schemas";

export const useVehicleReviews = (vehicleId: string) => {
  return useQuery({
    queryKey: ["reviews", "vehicle", vehicleId],
    queryFn: () => reviewApi.getReviewsByVehicle(vehicleId),
    enabled: !!vehicleId,
  });
};

export const useUserReviews = (userId: string) => {
  return useQuery({
    queryKey: ["reviews", "user", userId],
    queryFn: () => reviewApi.getReviewsByUser(userId),
    enabled: !!userId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewSchema) => reviewApi.createReview(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "vehicle", variables.vehicle_id],
      });

      queryClient.invalidateQueries({
        queryKey: ["reviews", "user", variables.user_id],
      });
    },
  });
};

export const useUpdateReview = (
  reviewId: string,
  vehicleId: string,
  userId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewSchema) =>
      reviewApi.updateReview(reviewId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "vehicle", vehicleId],
      });

      queryClient.invalidateQueries({
        queryKey: ["reviews", "user", userId],
      });
    },
  });
};

export const useDeleteReview = (vehicleId: string, userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewApi.deleteReview(reviewId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "vehicle", vehicleId],
      });

      queryClient.invalidateQueries({
        queryKey: ["reviews", "user", userId],
      });
    },
  });
};
