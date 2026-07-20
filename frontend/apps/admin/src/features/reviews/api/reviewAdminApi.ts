import { createReviewCommonApi } from "@repo/api";
import { axiosAdmin } from "@/hooks/axiosAdmin";

import type { Review, ReviewQueryParams } from "@repo/schemas";
import type { PaginationResponse } from "@repo/types";

export const reviewAdminApi = {
  ...createReviewCommonApi(axiosAdmin),

  async getReviews(params: ReviewQueryParams) {
    const data = await axiosAdmin.get<
      PaginationResponse<Review>,
      PaginationResponse<Review>
    >("/reviews/admin/filter", {
      params,
    });

    return data;
  },
};
