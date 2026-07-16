import axiosClient from "@/hooks/axiosClient";

import { createReviewCommonApi } from "@repo/api";

export const reviewClientApi = {
  ...createReviewCommonApi(axiosClient),
};
