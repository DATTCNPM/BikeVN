import { z } from "zod";

export const reviewCreationSchema = z.object({
  bookingId: z.string().min(1, "Booking không được để trống"),
  rating: z
    .number()
    .min(1, "Đánh giá tối thiểu 1 sao")
    .max(5, "Đánh giá tối đa 5 sao"),
  comment: z.string().optional(),
});

export const reviewSchema = reviewCreationSchema.extend({
  id: z.string(),
  userId: z.string(),
  vehicleId: z.string(),
  createdAt: z.string(),
});

export const publicReviewSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  rating: z.number(),
  comment: z.string().optional(),
  createdAt: z.string(),
});
