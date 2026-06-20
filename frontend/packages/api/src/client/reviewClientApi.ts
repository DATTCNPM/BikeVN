import axiosClient from "../axios/axiosClient";

import { createReviewCommonApi } from "../common/createReviewCommonApi";

export const reviewClientApi = {
  ...createReviewCommonApi(axiosClient),
};
