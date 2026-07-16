import { useQuery } from "@tanstack/react-query";

import { reviewAdminApi } from "../api/reviewAdminApi";
import { reviewKeys } from "@repo/hooks";
import type { ReviewQueryParams } from "@repo/types";

export const useAdminReviews = (params: ReviewQueryParams) =>
  useQuery({
    // Gọn gàng và cực kỳ an toàn
    queryKey: reviewKeys.adminFilter(params),

    queryFn: () => reviewAdminApi.getReviews(params),
  });
