import type { MonthlyRevenueParams } from "@repo/schemas";

export const statisticKeys = {
  all: ["statistic"] as const,

  general: () => [...statisticKeys.all, "general"] as const,

  charts: () => [...statisticKeys.all, "charts"] as const,

  monthlyRevenue: (params?: MonthlyRevenueParams) =>
    [...statisticKeys.charts(), "revenue-monthly", params || {}] as const,

  revenueByBranch: () => [...statisticKeys.charts(), "revenue-branch"] as const,

  popularVehicles: () =>
    [...statisticKeys.charts(), "popular-vehicles"] as const,
};
