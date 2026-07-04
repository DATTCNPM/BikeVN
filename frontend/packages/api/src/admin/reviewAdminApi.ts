import axiosAdmin from "../axios/axiosAdmin";

import type {
  PaginationResponse,
  Review,
  ReviewQueryParams,
} from "@repo/types";

import { createReviewCommonApi } from "../common/createReviewCommonApi";

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
