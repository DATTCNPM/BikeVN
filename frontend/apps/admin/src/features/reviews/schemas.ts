import { z } from "zod";

export const reviewAdminSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional().nullable(),
});

export type ReviewAdminFormValues = z.infer<typeof reviewAdminSchema>;
