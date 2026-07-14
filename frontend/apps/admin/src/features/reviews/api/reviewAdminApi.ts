import { axiosAdmin, createReviewCommonApi } from "@repo/api";

import type {
  PaginationResponse,
  Review,
  ReviewQueryParams,
} from "@repo/types";

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
