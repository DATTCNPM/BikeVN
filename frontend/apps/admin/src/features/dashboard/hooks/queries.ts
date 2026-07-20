import { useQuery } from "@tanstack/react-query";
import { statisticAdminApi } from "../api/statisticAdminApi";
import { statisticKeys } from "./statisticKeys";
import type { MonthlyRevenueParams } from "@repo/schemas";

// 1. Hook lấy số liệu tổng quan statistic
export const useAdminGeneralStats = () =>
  useQuery({
    queryKey: statisticKeys.general(),
    queryFn: () => statisticAdminApi.getGeneralStats(),
  });

// 2. Hook lấy dữ liệu doanh thu theo tháng (truyền object { year: 2026 } nếu cần)
export const useMonthlyRevenueChart = (params?: MonthlyRevenueParams) =>
  useQuery({
    queryKey: statisticKeys.monthlyRevenue(params),
    queryFn: () => statisticAdminApi.getMonthlyRevenue(params),
  });

// 3. Hook lấy dữ liệu doanh thu theo từng chi nhánh
export const useRevenueByBranchChart = (isAdminPath: boolean) =>
  useQuery({
    queryKey: statisticKeys.revenueByBranch(),
    queryFn: () => statisticAdminApi.getRevenueByBranch(),
    enabled: isAdminPath, // Chỉ kích hoạt khi đang ở phân hệ Admin
  });

// 4. Hook lấy dữ liệu danh sách xe phổ biến/thuê nhiều nhất
export const usePopularVehiclesChart = () =>
  useQuery({
    queryKey: statisticKeys.popularVehicles(),
    queryFn: () => statisticAdminApi.getPopularVehicles(),
  });
