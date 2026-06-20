import { z } from "zod";

import {
  reviewSchema,
  reviewCreationSchema,
  publicReviewSchema,
} from "@repo/schemas";

export type Review = z.infer<typeof reviewSchema>;

export type ReviewCreationPayload = z.infer<typeof reviewCreationSchema>;

export type PublicReview = z.infer<typeof publicReviewSchema>;
