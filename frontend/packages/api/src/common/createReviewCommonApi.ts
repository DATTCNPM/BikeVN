import type { AxiosInstance } from "axios";

import type { Review, ReviewCreationPayload } from "@repo/types";

export const createReviewCommonApi = (axiosInstance: AxiosInstance) => ({
  async createReview(payload: ReviewCreationPayload) {
    const data = await axiosInstance.post<Review, ReviewCreationPayload>(
      "/reviews",
      payload,
    );

    return data;
  },

  async deleteReview(id: string) {
    await axiosInstance.delete(`/reviews/${id}`);
  },
});
