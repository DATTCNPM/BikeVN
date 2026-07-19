import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
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

import {
  ChartSkeleton,
  ChartEmptyState,
} from "@/features/dashboard/components/ChartSkeleton";

export default function HomePage() {
  const [selectedYear] = useState<number>(new Date().getFullYear());
  const { pathname } = useLocation();

  // Xác định xem người dùng đang truy cập thông qua phân hệ Admin hay Employee
  const isAdminPath = pathname.startsWith("/admin");

  // 1. Các API dùng chung cho cả 2 phân hệ
  const { data: generalStats, isLoading: isStatsLoading } =
    useAdminGeneralStats();

  const { data: monthlyRevenue, isLoading: isRevenueLoading } =
    useMonthlyRevenueChart({ year: selectedYear });

  const { data: popularVehicles, isLoading: isVehiclesLoading } =
    usePopularVehiclesChart();

  // 2. Chỉ kích hoạt call API doanh thu chi nhánh nếu URL thuộc phân hệ /admin
  const { data: branchPerformance, isLoading: isBranchLoading } =
    useRevenueByBranchChart(isAdminPath); // Truyền isAdminPath vào hook để quyết định có gọi API hay không

  console.log("monthly revenue", monthlyRevenue);
  console.log("popular vehicles", popularVehicles);
  console.log("branch performance", branchPerformance);

  return (
    <div className="space-y-8 p-6">
      {/* OVERVIEW CARDS */}
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
      <section
        className={`grid gap-5 ${isAdminPath ? "lg:grid-cols-2" : "grid-cols-1"}`}
      >
        {/* Chỉ hiển thị Phần Branch Performance nếu đang ở URL Admin */}
        {isAdminPath && (
          <div>
            {isBranchLoading ? (
              <ChartSkeleton />
            ) : !branchPerformance || branchPerformance.length === 0 ? (
              <ChartEmptyState title="Branch Performance" />
            ) : (
              <BranchPerformanceChart data={branchPerformance} />
            )}
          </div>
        )}

        {/* Top Vehicles (Cả Admin và Employee đều xem được) */}
        <div>
          {isVehiclesLoading ? (
            <ChartSkeleton />
          ) : !popularVehicles || popularVehicles.length === 0 ? (
            <ChartEmptyState title="Top Vehicles" />
          ) : (
            <TopVehiclesChart data={popularVehicles} />
          )}
        </div>
      </section>
    </div>
  );
}
