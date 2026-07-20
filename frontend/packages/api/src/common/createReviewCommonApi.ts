// Nơi khai báo: createReviewCommonApi
import type { AxiosInstance } from "axios";
import type { Review, ReviewCreationPayload } from "@repo/schemas";

export const createReviewCommonApi = (axiosInstance: AxiosInstance) => ({
  createReview: async (payload: ReviewCreationPayload) => {
    const data = await axiosInstance.post<Review, ReviewCreationPayload>(
      "/reviews",
      payload,
    );
    return data;
  },

  deleteReview: async (id: string) => {
    await axiosInstance.delete(`/reviews/${id}`);
  },
});
