import { useState } from "react";
import { CalendarDays, Car, DollarSign, User, Users } from "lucide-react";

import DashboardCard from "@/features/dashboard/components/DashboardCard";
import RevenueChart from "@/features/dashboard/components/RevenueChart";
import BranchPerformanceChart from "@/features/dashboard/components/BranchPerformanceChart";
import TopVehiclesChart from "@/features/dashboard/components/TopVehiclesChart";

import {
  useAdminGeneralStats,
  useMonthlyRevenueChart,
  useRevenueByBranchChart,
  usePopularVehiclesChart,
} from "@/features/dashboard/hooks/queries";
// Import các UI phụ trợ vừa tạo ở trên
import {
  ChartSkeleton,
  ChartEmptyState,
} from "@/features/dashboard/components/ChartSkeleton";

export default function HomePage() {
  const [selectedYear] = useState<number>(new Date().getFullYear());

  // Gọi các API riêng biệt
  const { data: generalStats, isLoading: isStatsLoading } =
    useAdminGeneralStats();
  const { data: monthlyRevenue, isLoading: isRevenueLoading } =
    useMonthlyRevenueChart({ year: selectedYear });
  const { data: branchPerformance, isLoading: isBranchLoading } =
    useRevenueByBranchChart();
  const { data: popularVehicles, isLoading: isVehiclesLoading } =
    usePopularVehiclesChart();

  return (
    <div className="space-y-8 p-6">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of the vehicle rental management system.
        </p>
      </div>

      {/* OVERVIEW CARDS - Hiệu ứng nhấp nháy khi chưa có dữ liệu */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardCard
          title="Revenue"
          value={
            isStatsLoading
              ? "..."
              : `đ${generalStats?.totalRevenue?.toLocaleString() ?? 0}`
          }
          description="Total revenue of the system"
          icon={<DollarSign className="size-5" />}
          className={isStatsLoading ? "animate-pulse" : ""}
        />
        <DashboardCard
          title="Bookings"
          value={isStatsLoading ? "..." : (generalStats?.totalBookings ?? 0)}
          description="Total number of bookings"
          icon={<CalendarDays className="size-5" />}
          className={isStatsLoading ? "animate-pulse" : ""}
        />
        <DashboardCard
          title="Customers"
          value={isStatsLoading ? "..." : (generalStats?.totalCustomers ?? 0)}
          description="Total number of customers"
          icon={<Users className="size-5" />}
          className={isStatsLoading ? "animate-pulse" : ""}
        />
        <DashboardCard
          title="Employees"
          value={isStatsLoading ? "..." : (generalStats?.totalEmployees ?? 0)}
          description="Total number of employees"
          icon={<User className="size-5" />}
          className={isStatsLoading ? "animate-pulse" : ""}
        />
        <DashboardCard
          title="Vehicles"
          value={isStatsLoading ? "..." : (generalStats?.totalVehicles ?? 0)}
          description="Total number of vehicles"
          icon={<Car className="size-5" />}
          className={isStatsLoading ? "animate-pulse" : ""}
        />
      </section>

      {/* CHARTS SECTION 1: MONTHLY REVENUE */}
      <section className="grid gap-5 grid-cols-1">
        {isRevenueLoading ? (
          <ChartSkeleton />
        ) : !monthlyRevenue || monthlyRevenue.length === 0 ? (
          <ChartEmptyState title="Monthly Revenue" />
        ) : (
          <RevenueChart data={monthlyRevenue} />
        )}
      </section>

      {/* CHARTS SECTION 2: BRANCH PERFORMANCE & TOP VEHICLES */}
      <section className="grid gap-5 lg:grid-cols-2">
        {/* Branch Performance */}

        {isBranchLoading ? (
          <ChartSkeleton />
        ) : !branchPerformance || branchPerformance.length === 0 ? (
          <ChartEmptyState title="Branch Performance" />
        ) : (
          <BranchPerformanceChart data={branchPerformance} />
        )}

        {/* Top Vehicles */}

        {isVehiclesLoading ? (
          <ChartSkeleton />
        ) : !popularVehicles || popularVehicles.length === 0 ? (
          <ChartEmptyState title="Top Vehicles" />
        ) : (
          <TopVehiclesChart data={popularVehicles} />
        )}
      </section>
    </div>
  );
}
