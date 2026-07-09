import { useParams } from "react-router-dom";
import BookingActions from "@/features/bookings/components/BookingActions";
import BookingStatusHero from "@/features/bookings/components/BookingStatusHero";
import BookingTimeline from "@/features/bookings/components/BookingTimeline";
import BookingVehicleCard from "@/features/bookings/components/BookingVehicleCard";
import ExtraFeeReminder from "@/features/bookings/components/ExtraFeeReminder";
import CreateReviewSection from "@/features/reviews/components/CreateReviewSection";
import ReturnSurchargeCard from "@/features/bookings/components/ReturnSurchargeCard";

import { Spinner } from "@repo/ui/components/ui/spinner";
import { useVehicle, useBranches } from "@repo/hooks";
import {
  useBooking,
  useVehicleReturnByBookingId,
} from "@/features/bookings/queries";

export default function BookingResultPage() {
  const { id = "" } = useParams();

  const { data: booking, isLoading } = useBooking(id);
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(
    booking?.vehicleId || "",
  );
  const { data: branches = [], isLoading: branchesLoading } = useBranches();
  const { data: vehicleReturn, isLoading: returnLoading } =
    useVehicleReturnByBookingId(id);

  if (isLoading || vehicleLoading || branchesLoading || returnLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const pickupBranch = branches.find((b) => b.id === booking?.pickupBranchId);
  const returnBranch = branches.find((b) => b.id === booking?.returnBranchId);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8">
        <ExtraFeeReminder vehicleReturnData={vehicleReturn} />
        <BookingStatusHero status={booking?.status} />

        {/* Tích hợp toàn bộ thông tin Xe + Thông tin ID/Giá tiền tại đây */}
        <BookingVehicleCard
          booking={booking}
          vehicle={vehicle}
          pickupBranch={pickupBranch}
          returnBranch={returnBranch}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start">
          {/* CỘT TRÁI: CHỈ CÒN DUY NHẤT TIMELINE RÕ RÀNG */}
          <div className="space-y-6">
            <BookingTimeline status={booking?.status} />
            {booking?.status === "completed" && (
              <CreateReviewSection bookingId={booking.id} />
            )}
          </div>

          {/* CỘT PHẢI: SIDEBAR HÀNH ĐỘNG CỐ ĐỊNH NHỎ GỌN */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <BookingActions />

            {vehicleReturn && (
              <ReturnSurchargeCard vehicleReturn={vehicleReturn} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
