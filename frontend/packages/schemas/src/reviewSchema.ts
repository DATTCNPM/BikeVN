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

export const reviewQueryParamsSchema = z.object({
  bookingId: z.string().optional(),
  vehicleId: z.string().optional(),
  userId: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  page: z.number().default(1),
  size: z.number().default(10),
});
