import { z } from "zod";

import {
  vehicleModelSchema,
  vehicleModelCreationSchema,
  vehicleModelUpdateSchema,
  VehicleModelQueryParamsSchema,
} from "@repo/schemas";

export type VehicleModel = z.infer<typeof vehicleModelSchema>;

export type VehicleModelCreationRequest = z.infer<
  typeof vehicleModelCreationSchema
>;

export type VehicleModelUpdateRequest = z.infer<
  typeof vehicleModelUpdateSchema
>;

export type VehicleModelQueryParams = z.infer<
  typeof VehicleModelQueryParamsSchema
>;
