import { z } from "zod";

export const bookingAdminSchema = z.object({
  user_id: z.string().min(1, "User ID là bắt buộc"),
  vehicle_id: z.string().min(1, "Vehicle ID là bắt buộc"),
  pickup_branch_id: z.string().min(1, "Chi nhánh nhận là bắt buộc"),
  return_branch_id: z.string().min(1, "Chi nhánh trả là bắt buộc"),
  start_date: z.string().min(1, "Ngày nhận là bắt buộc"),
  end_date: z.string().min(1, "Ngày trả là bắt buộc"),
  total_price: z.number().min(0, "Tổng tiền không hợp lệ"),
  status: z.enum(["pending", "approved", "rejected", "completed", "cancelled"]),
});

export type BookingAdminFormValues = z.infer<typeof bookingAdminSchema>;
