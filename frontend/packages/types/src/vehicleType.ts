import { z } from "zod";

import {
  vehicleCardData,
  vehicleSchema,
  vehicleCreationSchema,
  vehicleUpdateSchema,
  vehicleStatusSchema,
  vehicleTypeSchema,
  vehicleQuerySchema,
} from "@repo/schemas";

export type Vehicle = z.infer<typeof vehicleSchema>;
export type VehicleCardData = z.infer<typeof vehicleCardData>;

export type VehicleCreationRequest = z.infer<typeof vehicleCreationSchema>;

export type VehicleUpdateRequest = z.infer<typeof vehicleUpdateSchema>;

export type VehicleQueryParams = z.infer<typeof vehicleQuerySchema>;

export type VehicleType = z.infer<typeof vehicleTypeSchema>;

export type StatusVehicleEnum = z.infer<typeof vehicleStatusSchema>;
