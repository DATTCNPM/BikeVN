import { z } from "zod";

import {
  vehicleImageSchema,
  vehicleImageCreationSchema,
  vehicleImageUpdateSchema,
} from "@repo/schemas";

export type VehicleImage = z.infer<typeof vehicleImageSchema>;

export type VehicleImageCreatePayload = z.infer<
  typeof vehicleImageCreationSchema
>;

export type VehicleImageUpdatePayload = z.infer<
  typeof vehicleImageUpdateSchema
>;
