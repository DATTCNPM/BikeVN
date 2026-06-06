import { z } from "zod";

import {
  vehicleBrandSchema,
  vehicleBrandCreationSchema,
  vehicleBrandUpdateSchema,
} from "@repo/schemas";

export type VehicleBrand = z.infer<typeof vehicleBrandSchema>;

export type VehicleBrandCreationRequest = z.infer<
  typeof vehicleBrandCreationSchema
>;

export type VehicleBrandUpdateRequest = z.infer<
  typeof vehicleBrandUpdateSchema
>;
