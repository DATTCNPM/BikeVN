import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@repo/api";
import { reviewsKeys } from "@repo/hooks";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => reviewApi.createReview(payload),
    onSuccess: (_, variables) => {
      if (variables?.vehicle_id)
        queryClient.invalidateQueries({
          queryKey: reviewsKeys.byVehicle(variables.vehicle_id),
        });
      if (variables?.user_id)
        queryClient.invalidateQueries({
          queryKey: reviewsKeys.byUser(variables.user_id),
        });
    },
  });
}
