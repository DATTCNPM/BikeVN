// pages/BookingResultPage.tsx
import { useParams } from "react-router-dom";

import BookingActions from "@/features/bookings/components/BookingActions";
import BookingInfoCard from "@/features/bookings/components/BookingInfoCard";
import BookingStatusHero from "@/features/bookings/components/BookingStatusHero";
import BookingTimeline from "@/features/bookings/components/BookingTimeline";
import BookingVehicleCard from "@/features/bookings/components/BookingVehicleCard";

import CreateReviewSection from "@/features/reviews/components/CreateReviewSection";

import { Spinner } from "@repo/ui/components/ui/spinner";

import { useVehicle, useBranches } from "@repo/hooks";
import { useBooking } from "@/features/bookings/queries";

export default function BookingResultPage() {
  const { id } = useParams();
  const { data: booking, isLoading } = useBooking(id!);
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(
    booking?.vehicleId || "",
  );
  const { data: branches = [], isLoading: branchesLoading } = useBranches();

  if (isLoading || vehicleLoading || branchesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

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

          {booking?.status === "completed" && (
            <CreateReviewSection bookingId={booking.id} />
          )}

          <BookingActions />
        </div>
      </div>
    </main>
  );
}
