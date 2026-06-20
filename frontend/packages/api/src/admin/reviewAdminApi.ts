import axiosAdmin from "../axios/axiosAdmin";

import type { PaginationResponse, Review } from "@repo/types";

import { createReviewCommonApi } from "../common/createReviewCommonApi";

export const reviewAdminApi = {
  ...createReviewCommonApi(axiosAdmin),

  async getReviews({
    bookingId,
    vehicleId,
    userId,
    rating,
    page,
    size,
  }: {
    bookingId?: string;
    vehicleId?: string;
    userId?: string;
    rating?: number;
    page: number;
    size: number;
  }) {
    const data = await axiosAdmin.get<
      PaginationResponse<Review>,
      PaginationResponse<Review>
    >("/reviews/admin/filter", {
      params: {
        bookingId,
        vehicleId,
        userId,
        rating,
        page,
        size,
      },
    });

    return data;
  },
};
