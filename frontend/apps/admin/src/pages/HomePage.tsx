import { useState } from "react";
import { CalendarDays, Car, DollarSign, Users } from "lucide-react";

import DashboardCard from "@/features/dashboard/components/DashboardCard";
import RevenueChart from "@/features/dashboard/components/RevenueChart";
import BranchPerformanceChart from "@/features/dashboard/components/BranchPerformanceChart";
import TopVehiclesChart from "@/features/dashboard/components/TopVehiclesChart";

import {
  useAdminGeneralStats,
  useMonthlyRevenueChart,
  useRevenueByBranchChart,
  usePopularVehiclesChart,
} from "@/features/dashboard/queries"; // Cập nhật lại đường dẫn chứa các hooks statistic mới

export default function HomePage() {
  // Quản lý năm lọc cho biểu đồ doanh thu theo tháng (mặc định lấy năm hiện tại)
  const [selectedYear] = useState<number>(new Date().getFullYear());

  // Gọi đồng thời các API riêng biệt từ Backend mới
  const { data: generalStats, isLoading: isStatsLoading } =
    useAdminGeneralStats();
  const { data: monthlyRevenue, isLoading: isRevenueLoading } =
    useMonthlyRevenueChart({ year: selectedYear });
  const { data: branchPerformance, isLoading: isBranchLoading } =
    useRevenueByBranchChart();
  const { data: popularVehicles, isLoading: isVehiclesLoading } =
    usePopularVehiclesChart();

  // Trạng thái Loading tổng hợp
  const isLoading =
    isStatsLoading || isRevenueLoading || isBranchLoading || isVehiclesLoading;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of the vehicle rental management system.
        </p>
      </div>

      {/* OVERVIEW CARDS (Khớp 100% với AdminGeneralStatResponse) */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Revenue"
          value={`$${generalStats?.totalRevenue?.toLocaleString() ?? 0}`}
          description="Total revenue of the system"
          icon={<DollarSign className="size-5" />}
        />

        <DashboardCard
          title="Bookings"
          value={generalStats?.totalBookings ?? 0}
          description="Total number of bookings"
          icon={<CalendarDays className="size-5" />}
        />

        <DashboardCard
          title="Users"
          value={generalStats?.totalUsers ?? 0}
          description="Total number of users"
          icon={<Users className="size-5" />}
        />

        <DashboardCard
          title="Vehicles"
          value={generalStats?.totalVehicles ?? 0}
          description="Total number of vehicles"
          icon={<Car className="size-5" />}
        />
      </section>

      {/* CHARTS SECTION 1: MONTHLY REVENUE */}
      <section className="grid gap-5 grid-cols-1">
        <RevenueChart data={monthlyRevenue ?? []} />
      </section>

      {/* CHARTS SECTION 2: BRANCH PERFORMANCE & TOP VEHICLES */}
      <section className="grid gap-5 lg:grid-cols-2">
        <BranchPerformanceChart data={branchPerformance ?? []} />
        <TopVehiclesChart data={popularVehicles ?? []} />
      </section>
    </div>
  );
}
