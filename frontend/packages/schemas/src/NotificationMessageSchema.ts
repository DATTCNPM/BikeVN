import { z } from "zod";

// Định nghĩa Schema bằng Zod
export const NotificationMessageSchema = z.object({
  type: z.string(), // "NEW_BOOKING_ALERT"
  branchId: z.string(), // ID chi nhánh nhận thông báo
  title: z.string(), // Tiêu đề: "New Booking !!!"
  content: z.string(), // Nội dung: "Xe [Tên xe] (License: [Biển số]) just rented!!!"
  referenceId: z.string(), // ID của Booking để click vào xem chi tiết
  timestamp: z.string(), // Thời gian bắn thông báo dưới dạng ISO string
});
