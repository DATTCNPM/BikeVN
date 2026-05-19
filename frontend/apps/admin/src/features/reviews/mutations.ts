import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@repo/api";
import { reviewsKeys } from "@repo/hooks";
import type { ReviewPayload } from "@repo/types";

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReviewPayload }) => 
      reviewApi.updateReview(id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: reviewsKeys.all });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewApi.deleteReview(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: reviewsKeys.all });
    },
  });
}
