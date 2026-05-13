import type { Booking } from "@/lib/types";

export const booking: Booking[] = [
  {
    id: "BK10234",
    status: "pending",
    total_price: 450000,
    vehicle_id: "1",
    user_id: "123456",
    created_at: "2026-05-13 14:20",
    updated_at: "2026-05-13 14:20",

    pickup_branch_id: "1",
    return_branch_id: "2",

    start_date: "2026-05-15 08:00",
    end_date: "2026-05-17 18:00",
  },
];
