import { z } from "zod";

import {
  branchSchema,
  createBranchSchema,
  updateBranchSchema,
  branchStatusSchema,
} from "@repo/schemas";

export type Branch = z.infer<typeof branchSchema>;

export type BranchStatus = z.infer<typeof branchStatusSchema>;

export type CreateBranchPayload = z.infer<typeof createBranchSchema>;

export type UpdateBranchPayload = z.infer<typeof updateBranchSchema>;
