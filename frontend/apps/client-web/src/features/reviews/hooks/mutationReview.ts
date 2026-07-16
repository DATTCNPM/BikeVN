import { useMutation, useQueryClient } from "@tanstack/react-query";

import { reviewClientApi } from "../api/reviewClientApi";
import { reviewKeys } from "@repo/hooks";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewClientApi.createReview,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.all,
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewClientApi.deleteReview,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.all,
      });
    },
  });
};
