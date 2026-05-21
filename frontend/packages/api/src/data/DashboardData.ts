import type { DashboardOverview } from "@repo/types";
export const dashboardData: DashboardOverview = {
  overview: {
    totalRevenue: 125000,
    totalBookings: 94,
    totalUsers: 230,
    totalVehicles: 56,
    availableVehicles: 40,
    averageRating: 4.7,
  },

  charts: {
    revenue: [
      { month: "Jan", revenue: 12000 },
      { month: "Feb", revenue: 18000 },
      { month: "Mar", revenue: 15000 },
      { month: "Apr", revenue: 22000 },
      { month: "May", revenue: 26000 },
      { month: "Jun", revenue: 30000 },
    ],

    bookingStatus: [
      { name: "Pending", value: 10 },
      { name: "Approved", value: 24 },
      { name: "Completed", value: 50 },
      { name: "Cancelled", value: 8 },
      { name: "Rejected", value: 4 },
    ],

    vehicleStatus: [
      { name: "Available", value: 40 },
      { name: "Unavailable", value: 10 },
      { name: "Maintenance", value: 6 },
    ],

    branchPerformance: [
      {
        branch: "Cà Mau",
        bookings: 30,
        revenue: 14000,
      },
      {
        branch: "Hồ Chí Minh",
        bookings: 52,
        revenue: 28000,
      },
      {
        branch: "Hà Nội",
        bookings: 38,
        revenue: 21000,
      },
    ],

    topVehicles: [
      {
        vehicle: "Toyota Vios",
        total: 24,
      },
      {
        vehicle: "Kia Morning",
        total: 18,
      },
      {
        vehicle: "Ford Ranger",
        total: 14,
      },
      {
        vehicle: "Honda City",
        total: 12,
      },
    ],
  },
  recentBookings: [
    {
      id: "#BK001",
      user: "Nguyễn Văn A",
      vehicle: "Toyota Vios",
      total: "$120",
      status: "Completed",
      created_at: "2026-05-17",
    },
    {
      id: "#BK002",
      user: "Trần Văn B",
      vehicle: "Ford Ranger",
      total: "$240",
      status: "Pending",
      created_at: "2026-05-16",
    },
    {
      id: "#BK003",
      user: "Lê Văn C",
      vehicle: "Honda City",
      total: "$160",
      status: "Approved",
      created_at: "2026-05-15",
    },
  ],

  recentReviews: [
    {
      id: "1",
      vehicle: "Toyota Vios",
      user: "Nguyễn Văn A",
      rating: 5,
      comment: "Xe rất sạch và dịch vụ tốt.",
      created_at: "2026-05-16",
    },
    {
      id: "2",
      vehicle: "Ford Ranger",
      user: "Trần Thị B",
      rating: 4,
      comment: "Trải nghiệm ổn, giao xe đúng giờ.",
      created_at: "2026-05-15",
    },
  ],
};
