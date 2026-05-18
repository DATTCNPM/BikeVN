export type DashboardOverview = {
  overview: {
    totalRevenue: number;
    totalBookings: number;
    totalUsers: number;
    totalVehicles: number;
    availableVehicles: number;
    averageRating: number;
  };

  charts: {
    revenue: {
      month: string;
      revenue: number;
    }[];

    bookingStatus: {
      name: string;
      value: number;
    }[];

    branchPerformance: {
      branch: string;
      bookings: number;
      revenue: number;
    }[];
    vehicleStatus: {
      name: string;
      value: number;
    }[];

    topVehicles: {
      vehicle: string;
      total: number;
    }[];
  };
  recentBookings: {
    id: string;
    user: string;
    vehicle: string;
    total: string;
    status: string;
    created_at: string;
  }[];

  recentReviews: {
    id: string;
    user: string;
    vehicle: string;
    rating: number;
    comment: string;
    created_at: string;
  }[];
};
