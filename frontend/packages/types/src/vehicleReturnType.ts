import { z } from "zod";

import {
  vehicleConditionStatusSchema,
  vehicleReturnSchema,
  createVehicleReturnSchema,
  updateVehicleReturnSchema,
} from "@repo/schemas";

export type VehicleConditionStatus = z.infer<
  typeof vehicleConditionStatusSchema
>;

export type VehicleReturn = z.infer<typeof vehicleReturnSchema>;

export type CreateVehicleReturnRequest = z.infer<
  typeof createVehicleReturnSchema
>;

export type UpdateVehicleReturnRequest = z.infer<
  typeof updateVehicleReturnSchema
>;
