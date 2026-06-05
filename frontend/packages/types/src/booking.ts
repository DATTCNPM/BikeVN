import { z } from "zod";
import { bookingSchema, bookingCreationSchema } from "@repo/schemas";

export type Booking = z.infer<typeof bookingSchema>;

export type BookingCreationPayload = z.infer<typeof bookingCreationSchema>;
