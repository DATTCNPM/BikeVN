import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewAdminApi } from "../api/reviewAdminApi";
import { reviewKeys } from "@repo/hooks";
import type { ReviewCreationPayload } from "@repo/types";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Khai báo rõ kiểu dữ liệu payload đầu vào
    mutationFn: (payload: ReviewCreationPayload) =>
      reviewAdminApi.createReview(payload),

    onSuccess: async () => {
      // Thêm await để giải quyết lỗi lơ là Promise của invalidateQueries
      await queryClient.invalidateQueries({
        queryKey: reviewKeys.all,
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Khai báo rõ tham số đầu vào là string id
    mutationFn: (id: string) => reviewAdminApi.deleteReview(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: reviewKeys.all,
      });
    },
  });
};
