import {
  CalendarDays,
  Car,
  CircleCheckBig,
  DollarSign,
  Star,
  Users,
} from "lucide-react";

import DashboardCard from "@/components/dashboard/DashboardCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import BookingStatusChart from "@/components/dashboard/BookingStatusChart";
import VehicleStatusChart from "@/components/dashboard/VehicleStatusChart";
import BranchPerformanceChart from "@/components/dashboard/BranchPerformanceChart";
import TopVehiclesChart from "@/components/dashboard/TopVehiclesChart";
import RecentBookingsTable from "@/components/dashboard/RecentBookingsTable";
import RecentReviews from "@/components/dashboard/RecentReviews";

import { useDashboardOverview } from "@/hooks/useDashboard";

export default function HomePage() {
  const { data, isLoading } = useDashboardOverview();

  if (isLoading || !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Đang tải dashboard...</p>
      </div>
    );
  }

  const { overview, charts, recentBookings, recentReviews } = data;

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <p className="text-muted-foreground">
          Tổng quan hệ thống quản lý thuê xe.
        </p>
      </div>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Doanh thu"
          value={`$${overview.totalRevenue}`}
          description="Tổng doanh thu hệ thống"
          icon={<DollarSign className="size-5" />}
        />

        <DashboardCard
          title="Đơn thuê"
          value={overview.totalBookings}
          description="Tổng số booking"
          icon={<CalendarDays className="size-5" />}
        />

        <DashboardCard
          title="Người dùng"
          value={overview.totalUsers}
          description="Tổng khách hàng"
          icon={<Users className="size-5" />}
        />

        <DashboardCard
          title="Xe"
          value={overview.totalVehicles}
          description="Tổng số xe"
          icon={<Car className="size-5" />}
        />

        <DashboardCard
          title="Xe khả dụng"
          value={overview.availableVehicles}
          description="Sẵn sàng cho thuê"
          icon={<CircleCheckBig className="size-5" />}
        />

        <DashboardCard
          title="Đánh giá"
          value={`${overview.averageRating}/5`}
          description="Trung bình đánh giá"
          icon={<Star className="size-5" />}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-7">
        <div className="xl:col-span-5">
          <RevenueChart data={charts.revenue} />
        </div>

        <div className="xl:col-span-2">
          <BookingStatusChart data={charts.bookingStatus} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <VehicleStatusChart data={charts.vehicleStatus} />

        <BranchPerformanceChart data={charts.branchPerformance} />
      </section>

      <section>
        <TopVehiclesChart data={charts.topVehicles} />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentBookingsTable data={recentBookings} />
        </div>

        <div className="xl:col-span-1">
          <RecentReviews data={recentReviews} />
        </div>
      </section>
    </div>
  );
}
