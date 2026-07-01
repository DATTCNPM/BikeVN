// pages/BookingResultPage.tsx
import { useParams } from "react-router-dom";

import BookingActions from "@/features/bookings/components/BookingActions";
import BookingInfoCard from "@/features/bookings/components/BookingInfoCard";
import BookingStatusHero from "@/features/bookings/components/BookingStatusHero";
import BookingTimeline from "@/features/bookings/components/BookingTimeline";
import BookingVehicleCard from "@/features/bookings/components/BookingVehicleCard";
import ExtraFeeReminder from "@/features/bookings/components/ExtraFeeReminder"; // THÊM MỚI

import CreateReviewSection from "@/features/reviews/components/CreateReviewSection";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { useVehicle, useBranches } from "@repo/hooks";
import {
  useBooking,
  useVehicleReturnByBookingId,
} from "@/features/bookings/queries"; // THÊM HOOK RETURN

export default function BookingResultPage() {
  const { id = "" } = useParams();

  const { data: booking, isLoading } = useBooking(id);
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(
    booking?.vehicleId || "",
  );
  const { data: branches = [], isLoading: branchesLoading } = useBranches();

  // 🟢 THÊM MỚI: Gọi API kiểm tra biên bản trả xe (và nuốt lỗi 404 nếu chưa có nhờ xử lý trước đó)
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
      <div className="container mx-auto max-w-5xl space-y-8 px-4 py-10">
        {/* 🟢 TỰ ĐỘNG BẬT KHI CÓ KHOẢN PHẠT PENDING */}
        <ExtraFeeReminder vehicleReturn={vehicleReturn} />

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
