// src/data/BookingData.ts

import type { Booking } from "@/lib/types";

export const bookings: Booking[] = [
  {
    id: crypto.randomUUID(),
    user_id: "u1",

    vehicle_id: "1",

    pickup_branch_id: "1",

    return_branch_id: "2",

    start_date: "2026-05-20",

    end_date: "2026-05-25",

    actual_return_date: null,

    total_price: 1200,

    status: "pending",

    created_at: new Date().toISOString(),

    updated_at: new Date().toISOString(),
  },

  {
    id: crypto.randomUUID(),

    user_id: "u2",

    vehicle_id: "2",

    pickup_branch_id: "2",

    return_branch_id: "2",

    start_date: "2026-05-10",

    end_date: "2026-05-15",

    actual_return_date: "2026-05-15",

    total_price: 1800,

    status: "completed",

    created_at: new Date().toISOString(),

    updated_at: new Date().toISOString(),
  },
];
