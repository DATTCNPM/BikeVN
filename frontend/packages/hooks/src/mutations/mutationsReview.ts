import { useMutation, useQueryClient } from "@tanstack/react-query";

import { reviewClientApi } from "@repo/api";
import { reviewKeys } from "../queryKeys/reviewKeys";

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
