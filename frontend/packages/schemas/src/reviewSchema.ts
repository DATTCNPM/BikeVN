import { z } from "zod";

export const reviewCreationSchema = z.object({
  bookingId: z.string(),
  rating: z
    .number()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating must be at most 5 stars"),
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
