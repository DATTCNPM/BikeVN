import { z } from "zod";
import {
  monthlyRevenueParamsSchema,
  chartDataResponseSchema,
  adminGeneralStatResponseSchema,
} from "@repo/schemas";
export type MonthlyRevenueParams = z.infer<typeof monthlyRevenueParamsSchema>;
export type ChartDataResponse = z.infer<typeof chartDataResponseSchema>;
export type AdminGeneralStatResponse = z.infer<
  typeof adminGeneralStatResponseSchema
>;
