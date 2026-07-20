import { z } from "zod";

// --- SCHEMAS ---

// Schema cho request query parameter của monthly revenue
export const monthlyRevenueParamsSchema = z.object({
  year: z.number().int().optional(),
});

// Schema đại diện cho từng item trong mảng dữ liệu biểu đồ trả về (ChartDataResponse)
export const chartDataResponseSchema = z.object({
  label: z.string(), // ví dụ: "January", "Branch A", "Honda Vision"
  value: z.number(), // ví dụ: doanh thu hoặc số lượt đặt xe
});

// Schema cho số liệu tổng quan (AdminGeneralStatResponse)
// Bạn có thể tùy chỉnh lại các trường này đúng theo DTO của backend
export const adminGeneralStatResponseSchema = z.object({
  totalRevenue: z.number(),
  totalBookings: z.number(),
  totalCustomers: z.number(),
  totalVehicles: z.number(),
  totalEmployees: z.number(),
});

export type MonthlyRevenueParams = z.infer<typeof monthlyRevenueParamsSchema>;
export type ChartDataResponse = z.infer<typeof chartDataResponseSchema>;
export type AdminGeneralStatResponse = z.infer<
  typeof adminGeneralStatResponseSchema
>;
