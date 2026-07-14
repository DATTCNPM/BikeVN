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
} from "@/features/bookings/hooks/queries";

export default function BookingResultPage() {
  const { id = "" } = useParams();

  const { data: booking, isLoading } = useBooking(id);
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(
    booking?.vehicleId || "",
  );
  const { data: branches = [], isLoading: branchesLoading } = useBranches();

  // 🌟 ĐIỀU KIỆN THÔNG MINH: Chỉ tìm biên bản trả xe nếu đơn hàng đã sang trạng thái trả xe/hoàn thành
  const hasReturnInfo = booking?.status === "completed";

  const { data: vehicleReturn, isLoading: returnLoading } =
    useVehicleReturnByBookingId(id, { enabled: !!booking && hasReturnInfo });

  // 🌟 SỬA ĐIỀU KIỆN LOADING: returnLoading chỉ chặn nếu đơn hàng ĐỦ ĐIỀU KIỆN có biên bản phạt
  const isPageLoading =
    isLoading ||
    vehicleLoading ||
    branchesLoading ||
    (hasReturnInfo && returnLoading);

  if (isPageLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Chặn trường hợp gõ sai ID trên URL gây vỡ Layout
  if (!booking) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-sm font-medium text-muted-foreground">
        Booking order details could not be found.
      </div>
    );
  }

  const pickupBranch = branches.find((b) => b.id === booking?.pickupBranchId);
  const returnBranch = branches.find((b) => b.id === booking?.returnBranchId);

  console.log("BookingResultPage: booking", booking);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8">
        {/* Chỉ truyền dữ liệu phạt nếu thực sự tìm thấy */}
        {vehicleReturn && (
          <ExtraFeeReminder vehicleReturnData={vehicleReturn} />
        )}

        <BookingStatusHero status={booking?.status} />

        <BookingVehicleCard
          booking={booking}
          vehicle={vehicle}
          pickupBranch={pickupBranch}
          returnBranch={returnBranch}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start">
          {/* CỘT TRÁI */}
          <div className="space-y-6">
            <BookingTimeline status={booking?.status} />
            {booking?.status === "completed" && (
              <CreateReviewSection bookingId={booking.id} />
            )}
          </div>

          {/* CỘT PHẢI */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <BookingActions bookingId={booking.id} status={booking.status} />

            {/* Chỉ hiện card phạt khi có thông tin trả xe từ admin */}
            {vehicleReturn && (
              <ReturnSurchargeCard vehicleReturn={vehicleReturn} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
