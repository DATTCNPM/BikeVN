// src/apis/dashboardApi.ts

import { dashboardData } from "./data/DashboardData";
import type { DashboardOverview } from "@repo/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardApi = {
  async getDashboardOverview(): Promise<DashboardOverview> {
    await delay(500);

    return dashboardData;
  },
};
