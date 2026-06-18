import {
  CalendarDays,
  Car,
  CircleCheckBig,
  DollarSign,
  Star,
  Users,
} from "lucide-react";

import DashboardCard from "@/features/dashboard/components/DashboardCard";
import RevenueChart from "@/features/dashboard/components/RevenueChart";
import BookingStatusChart from "@/features/dashboard/components/BookingStatusChart";
import VehicleStatusChart from "@/features/dashboard/components/VehicleStatusChart";
import BranchPerformanceChart from "@/features/dashboard/components/BranchPerformanceChart";
import TopVehiclesChart from "@/features/dashboard/components/TopVehiclesChart";
import RecentBookingsTable from "@/features/dashboard/components/RecentBookingsTable";
import RecentReviews from "@/features/dashboard/components/RecentReviews";

import { useDashboardOverview } from "@/features/dashboard/queries";

export default function HomePage() {
  const { data, isLoading } = useDashboardOverview();

  if (isLoading || !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const { overview, charts, recentBookings, recentReviews } = data;

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <p className="text-muted-foreground">
          Overview of the vehicle rental management system.
        </p>
      </div>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Revenue"
          value={`$${overview.totalRevenue}`}
          description="Total revenue of the system"
          icon={<DollarSign className="size-5" />}
        />

        <DashboardCard
          title="Bookings"
          value={overview.totalBookings}
          description="Total number of bookings"
          icon={<CalendarDays className="size-5" />}
        />

        <DashboardCard
          title="Users"
          value={overview.totalUsers}
          description="Total number of users"
          icon={<Users className="size-5" />}
        />

        <DashboardCard
          title="Vehicles"
          value={overview.totalVehicles}
          description="Total number of vehicles"
          icon={<Car className="size-5" />}
        />

        <DashboardCard
          title="Available Vehicles"
          value={overview.availableVehicles}
          description="Ready for rental"
          icon={<CircleCheckBig className="size-5" />}
        />

        <DashboardCard
          title="Ratings"
          value={`${overview.averageRating}/5`}
          description="Average rating"
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
