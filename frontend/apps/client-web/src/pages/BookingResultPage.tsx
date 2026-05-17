// pages/BookingResultPage.tsx
import { useParams } from "react-router-dom";

import BookingActions from "@/components/booking/BookingActions";
import BookingInfoCard from "@/components/booking/BookingInfoCard";
import BookingStatusHero from "@/components/booking/BookingStatusHero";
import BookingTimeline from "@/components/booking/BookingTimeline";
import BookingVehicleCard from "@/components/booking/BookingVehicleCard";

import { Spinner } from "@repo/ui/components/ui/spinner";
import { toast } from "sonner";
import { useEffect } from "react";

import { useBooking } from "@/hooks/useBooking";
import { useVehicle } from "@/hooks/useVehicle";
import { useBranches } from "@/hooks/useBranch";

export default function BookingResultPage() {
  const { id } = useParams();
  const { data: booking, isLoading, error } = useBooking(id!);
  const {
    data: vehicle,
    isLoading: vehicleLoading,
    error: vehicleError,
  } = useVehicle(booking?.vehicle_id || "");
  const {
    data: branches,
    isLoading: branchesLoading,
    error: branchesError,
  } = useBranches();

  useEffect(() => {
    if (error) {
      toast.error("Failed to load booking details. Please try again.");
    }

    if (vehicleError) {
      toast.error("Failed to load vehicle details. Please try again.");
    }

    if (branchesError) {
      toast.error("Failed to load branches details. Please try again.");
    }
  }, [error, vehicleError, branchesError]);
  if (isLoading || vehicleLoading || branchesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const selectedBooking = booking;
  const selectedVehicle = vehicle;

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
