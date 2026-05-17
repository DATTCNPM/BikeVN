import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "@repo/api";

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ["dashboard-overview"],

    queryFn: () => dashboardApi.getDashboardOverview(),
  });
};
