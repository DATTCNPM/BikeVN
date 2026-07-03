import { z } from "zod";

import {
  vehicleBrandSchema,
  vehicleBrandCreationSchema,
  vehicleBrandUpdateSchema,
  VehicleBrandQueryParamsSchema,
} from "@repo/schemas";

export type VehicleBrand = z.infer<typeof vehicleBrandSchema>;

export type VehicleBrandCreationRequest = z.infer<
  typeof vehicleBrandCreationSchema
>;

export type VehicleBrandUpdateRequest = z.infer<
  typeof vehicleBrandUpdateSchema
>;

export type VehicleBrandQueryParams = z.infer<
  typeof VehicleBrandQueryParamsSchema
>;
