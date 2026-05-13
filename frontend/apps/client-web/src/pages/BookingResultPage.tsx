// pages/BookingResultPage.tsx

import BookingActions from "@/components/booking/BookingActions";
import BookingInfoCard from "@/components/booking/BookingInfoCard";
import BookingStatusHero from "@/components/booking/BookingStatusHero";
import BookingTimeline from "@/components/booking/BookingTimeline";
import BookingVehicleCard from "@/components/booking/BookingVehicleCard";

import type { Booking } from "@/lib/types";

const booking: Booking = {
  id: "BK10234",
  status: "pending",
  total_price: 450000,
  vehicle_id: "1",
  user_id: "123456",
  created_at: "2026-05-13 14:20",
  updated_at: "2026-05-13 14:20",

  pickup_branch_id: "Cần Thơ",
  return_branch_id: "Cà Mau",

  start_date: "2026-05-15 08:00",
  end_date: "2026-05-17 18:00",
};

export default function BookingResultPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl space-y-8 px-4 py-10">
        <BookingStatusHero status={booking.status} />

        <BookingVehicleCard booking={booking} />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <BookingInfoCard booking={booking} />

            <BookingTimeline status={booking.status} />
          </div>

          <BookingActions />
        </div>
      </div>
    </main>
  );
}
