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

import { useBooking } from "@/features/bookings/queries";
import { useVehicle } from "@repo/hooks";
import { useBranches } from "@repo/hooks";

export default function BookingResultPage() {
  const { id } = useParams();
  const { data: booking, isLoading, error } = useBooking(id!);
  const {
    data: vehicle,
    isLoading: vehicleLoading,
    error: vehicleError,
  } = useVehicle(booking?.vehicleId || "");
  const {
    data: branches = [],
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

  console.log("Selected Booking:", booking);
  console.log("Selected Vehicle:", vehicle);
  console.log("Branches:", branches);

  // Tên chi nhánh lấy từ selectedBooking.pickup_branch_id và selectedBooking.return_branch_id
  const pickupBranch = branches.find((b) => b.id === booking?.pickupBranchId);
  const returnBranch = branches.find((b) => b.id === booking?.returnBranchId);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl space-y-8 px-4 py-10">
        <BookingStatusHero status={booking?.status || null} />

        <BookingVehicleCard
          booking={booking || null}
          vehicle={vehicle || null}
          pickupBranch={pickupBranch}
          returnBranch={returnBranch}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <BookingInfoCard booking={booking || null} />

            <BookingTimeline status={booking?.status || null} />
          </div>

          <BookingActions />
        </div>
      </div>
    </main>
  );
}
