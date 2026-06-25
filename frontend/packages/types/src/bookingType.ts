import { z } from "zod";
import {
  bookingSchema,
  bookingCreationSchema,
  bookingStatusSchema,
  bookingFormSchema,
  bookingUpdateSchema,
  bookingFilterSchema,
} from "@repo/schemas";

// Kiểu TypeScript cho Booking, được tạo từ bookingSchema
export type Booking = z.infer<typeof bookingSchema>;
// Tạo kiểu TypeScript cho trạng thái booking
export type BookingStatus = z.infer<typeof bookingStatusSchema>;
// Tạo kiểu TypeScript cho giá trị form khi tạo booking mới
export type BookingFormValues = z.infer<typeof bookingFormSchema>;
// Tạo kiểu TypeScript cho payload khi tạo booking mới
export type BookingCreationPayload = z.infer<typeof bookingCreationSchema>;

// Tạo kiểu TypeScript cho payload khi cập nhật booking
export type UpdateBookingPayload = z.infer<typeof bookingUpdateSchema>;
// Tạo kiểu TypeScript cho filter khi lọc booking
export type BookingFilter = z.infer<typeof bookingFilterSchema>;
