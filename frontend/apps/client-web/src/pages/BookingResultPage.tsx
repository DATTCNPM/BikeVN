// pages/BookingResultPage.tsx
import { useParams } from "react-router-dom";

import BookingActions from "@/components/booking/BookingActions";
import BookingInfoCard from "@/components/booking/BookingInfoCard";
import BookingStatusHero from "@/components/booking/BookingStatusHero";
import BookingTimeline from "@/components/booking/BookingTimeline";
import BookingVehicleCard from "@/components/booking/BookingVehicleCard";

import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

import { useBookingStore } from "@/stores/useBookingStore";
import { useVehicleStore } from "@/stores/useVehicleStore";
import { useBranchStore } from "@/stores/useBranchStore";

import { useEffect } from "react";

export default function BookingResultPage() {
  const { id } = useParams();
  const { selectedVehicle, fetchVehicleById } = useVehicleStore();
  const { branches, fetchBranches } = useBranchStore();
  const { selectedBooking, fetchBookingById } = useBookingStore();

  useEffect(() => {
    fetchVehicleById(selectedBooking?.vehicle_id || "");
    fetchBranches();
    fetchBookingById(id || "");
  }, [
    fetchVehicleById,
    fetchBranches,
    fetchBookingById,
    id,
    selectedBooking?.vehicle_id,
  ]);

  console.log("Selected Booking:", selectedBooking);
  console.log("Selected Vehicle:", selectedVehicle);
  console.log("Branches:", branches);

  // Tên chi nhánh lấy từ selectedBooking.pickup_branch_id và selectedBooking.return_branch_id
  const pickupBranch = branches.find(
    (b) => b.id === selectedBooking?.pickup_branch_id,
  );
  const returnBranch = branches.find(
    (b) => b.id === selectedBooking?.return_branch_id,
  );

  // if (loading || branchesLoading || bookingsLoading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <Spinner />
  //     </div>
  //   );
  // }
  // if (error || branchesError || bookingsError) {
  //   toast.error("Failed to load booking details. Please try again.");
  //   return null;
  // }
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl space-y-8 px-4 py-10">
        <BookingStatusHero status={selectedBooking?.status || null} />

        <BookingVehicleCard
          booking={selectedBooking}
          vehicle={selectedVehicle}
          pickupBranch={pickupBranch}
          returnBranch={returnBranch}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <BookingInfoCard booking={selectedBooking} />

            <BookingTimeline status={selectedBooking?.status || null} />
          </div>

          <BookingActions />
        </div>
      </div>
    </main>
  );
}
