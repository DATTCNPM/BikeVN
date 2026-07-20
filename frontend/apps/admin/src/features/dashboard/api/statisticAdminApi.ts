import { axiosAdmin } from "@/hooks/axiosAdmin";
import type {
  AdminGeneralStatResponse,
  ChartDataResponse,
  MonthlyRevenueParams,
} from "@repo/schemas";

export const statisticAdminApi = {
  // GET /statistics/general
  getGeneralStats() {
    return axiosAdmin.get<AdminGeneralStatResponse, AdminGeneralStatResponse>(
      "/statistics/general",
    );
  },

  // GET /statistics/charts/revenue-monthly
  async getMonthlyRevenue(params?: MonthlyRevenueParams) {
    const data = await axiosAdmin.get<ChartDataResponse[], ChartDataResponse[]>(
      "/statistics/charts/revenue-monthly",
      {
        params,
      },
    );
    return data;
  },

  // GET /statistics/charts/revenue-branch
  async getRevenueByBranch() {
    const data = await axiosAdmin.get<ChartDataResponse[], ChartDataResponse[]>(
      "/statistics/charts/revenue-branch",
    );
    return data;
  },

  // GET /statistics/charts/popular-vehicles
  async getPopularVehicles() {
    const data = await axiosAdmin.get<ChartDataResponse[], ChartDataResponse[]>(
      "/statistics/charts/popular-vehicles",
    );
    return data;
  },
};
