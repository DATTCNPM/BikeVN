import { useQuery } from "@tanstack/react-query";

import { reviewPublicApi } from "@repo/api";
import { reviewKeys } from "@repo/hooks";
import type { ReviewQueryParams } from "@repo/types";

export const usePublicReviews = ({
  params,
}: {
  params: ReviewQueryParams;
}) =>
  useQuery({
    queryKey: reviewKeys.publicFilter(params),

    queryFn: () =>
      reviewPublicApi.getPublicReviews({
        ...params,
      }),
  });
