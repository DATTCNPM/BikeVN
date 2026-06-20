import axiosPublic from "../axios/axiosPublic";

import type { PaginationResponse, Review, PublicReview } from "@repo/types";

export const reviewPublicApi = {
  async getVehicleReviews({
    vehicleId,
    page,
    size,
  }: {
    vehicleId: string;
    page: number;
    size: number;
  }) {
    const data = await axiosPublic.get<
      PaginationResponse<Review>,
      PaginationResponse<Review>
    >(`/reviews/vehicles/${vehicleId}`, {
      params: {
        page,
        size,
      },
    });

    return data;
  },

  async getBranchReviews({
    branchId,
    page,
    size,
  }: {
    branchId: string;
    page: number;
    size: number;
  }) {
    const data = await axiosPublic.get<
      PaginationResponse<Review>,
      PaginationResponse<Review>
    >(`/reviews/branches/${branchId}`, {
      params: {
        page,
        size,
      },
    });

    return data;
  },

  async getPublicReviews({
    vehicleId,
    rating,
    page,
    size,
  }: {
    vehicleId?: string;
    rating?: number;
    page: number;
    size: number;
  }) {
    const data = await axiosPublic.get<
      PaginationResponse<PublicReview>,
      PaginationResponse<PublicReview>
    >("/reviews/public/filter", {
      params: {
        vehicleId,
        rating,
        page,
        size,
      },
    });

    return data;
  },
};
