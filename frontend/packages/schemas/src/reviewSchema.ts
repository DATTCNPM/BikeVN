import { z } from "zod";

export const reviewSchema = z.object({
  booking_id: z.string().min(1, "Booking không hợp lệ"),

  user_id: z.string().min(1, "Người dùng không hợp lệ"),

  vehicle_id: z.string().min(1, "Xe không hợp lệ"),

  rating: z
    .number({
      message: "Vui lòng nhập số sao",
    })
    .min(1, "Đánh giá tối thiểu 1 sao")
    .max(5, "Đánh giá tối đa 5 sao"),

  comment: z
    .string()
    .max(500, "Bình luận tối đa 500 ký tự")
    .nullable()
    .optional(),
});

export type ReviewSchema = z.infer<typeof reviewSchema>;
