// src/apis/reviewApi.ts

import { reviews } from "./data/ReviewData";

import type { Review, ReviewPayload } from "@repo/types";

import { users } from "./data/UserData";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const reviewApi = {
  async getReviewsByVehicle(
    vehicleId: string,
  ): Promise<(Review & { user: { name: string; email: string } })[]> {
    await delay(500);
    const vehicleReviews = reviews.filter(
      (review) => review.vehicle_id === vehicleId,
    );

    return vehicleReviews.map((review) => ({
      ...review,
      user: users.find((user) => user.id === review.user_id) || {
        email: "unknown",
        name: "Unknown User",
      },
    }));
  },

  async getReviews(): Promise<(Review & { user: { name: string; email: string } })[]> {
    await delay(500);

    return reviews.map((review) => ({
      ...review,
      user: users.find((user) => user.id === review.user_id) || {
        email: "unknown",
        name: "Unknown User",
      },
    }));
  },

  async getReviewsByUser(userId: string): Promise<Review[]> {
    await delay(500);

    return reviews.filter((review) => review.user_id === userId);
  },

  async createReview(
    payload: ReviewPayload,
  ): Promise<{ message: string; review: Review }> {
    await delay(500);

    const existedReview = reviews.find(
      (review) =>
        review.booking_id === payload.booking_id &&
        review.user_id === payload.user_id,
    );

    if (existedReview) {
      throw {
        response: {
          status: 400,
          data: {
            message: "Bạn đã đánh giá đơn đặt xe này rồi",
          },
        },
      };
    }

    const newReview: Review = {
      id: crypto.randomUUID(),
      booking_id: payload.booking_id,
      user_id: payload.user_id,
      vehicle_id: payload.vehicle_id,
      rating: payload.rating,
      comment: payload.comment ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: users.find((user) => user.id === payload.user_id) || {
        email: "unknown",
        name: "Unknown User",
      },
    };

    reviews.unshift(newReview);

    return {
      message: "Đánh giá thành công",
      review: newReview,
    };
  },

  async updateReview(
    reviewId: string,
    payload: ReviewPayload,
  ): Promise<{ message: string; review: Review }> {
    await delay(500);

    const reviewIndex = reviews.findIndex((review) => review.id === reviewId);

    if (reviewIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Đánh giá không tồn tại",
          },
        },
      };
    }

    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      rating: payload.rating,
      comment: payload.comment ?? null,
      updated_at: new Date().toISOString(),
    };

    return {
      message: "Cập nhật đánh giá thành công",
      review: reviews[reviewIndex],
    };
  },

  async deleteReview(reviewId: string): Promise<{ message: string }> {
    await delay(500);

    const reviewIndex = reviews.findIndex((review) => review.id === reviewId);

    if (reviewIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Đánh giá không tồn tại",
          },
        },
      };
    }

    reviews.splice(reviewIndex, 1);

    return {
      message: "Xóa đánh giá thành công",
    };
  },
};
