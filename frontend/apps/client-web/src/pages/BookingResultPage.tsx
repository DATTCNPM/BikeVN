// pages/BookingResultPage.tsx
import { useParams } from "react-router-dom";

import BookingActions from "@/components/booking/BookingActions";
import BookingInfoCard from "@/components/booking/BookingInfoCard";
import BookingStatusHero from "@/components/booking/BookingStatusHero";
import BookingTimeline from "@/components/booking/BookingTimeline";
import BookingVehicleCard from "@/components/booking/BookingVehicleCard";

import { booking } from "@/constants/BookingSample";
import { useVehicleStore } from "@/stores/useVehicleStore";
import { useBranchStore } from "@/stores/useBranchStore";

import { useEffect } from "react";

export default function BookingResultPage() {
  const { id } = useParams();
  const { selectedVehicle, fetchVehicleById } = useVehicleStore();
  const { branches, fetchBranches } = useBranchStore();

  useEffect(() => {
    fetchVehicleById(id || "");
    fetchBranches();
  }, [fetchVehicleById, fetchBranches]);

  const bookingData = booking.find((b) => b.id === id) || booking[0];
  //   Lấy thông tin xe từ bookingData.vehicle_id và DataVehicleSample

  // Tên chi nhánh lấy từ bookingData.pickup_branch_id và bookingData.return_branch_id
  const pickupBranch = branches.find(
    (b) => b.id === bookingData.pickup_branch_id,
  );
  const returnBranch = branches.find(
    (b) => b.id === bookingData.return_branch_id,
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl space-y-8 px-4 py-10">
        <BookingStatusHero status={bookingData.status} />

        <BookingVehicleCard
          booking={bookingData}
          vehicle={selectedVehicle}
          pickupBranch={pickupBranch}
          returnBranch={returnBranch}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <BookingInfoCard booking={bookingData} />

            <BookingTimeline status={bookingData.status} />
          </div>

          <BookingActions />
        </div>
      </div>
    </main>
  );
}
