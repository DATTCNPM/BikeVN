import { useQuery } from "@tanstack/react-query";

import { reviewPublicApi } from "@repo/api";
import { reviewKeys } from "@repo/hooks";

export const useBranchReviews = ({
  branchId,
  page,
  size,
}: {
  branchId: string;
  page: number;
  size: number;
}) =>
  useQuery({
    queryKey: reviewKeys.branch(branchId, page, size),

    queryFn: () =>
      reviewPublicApi.getBranchReviews({
        branchId,
        page,
        size,
      }),
  });
