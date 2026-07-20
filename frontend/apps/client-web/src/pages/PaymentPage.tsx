import PaymentBookingCard from "@/features/payments/components/PaymentBookingCard";
import PaymentCustomerCard from "@/features/payments/components/PaymentCustomerCard";
import PaymentHeader from "@/features/payments/components/PaymentHeader";
import PaymentMethodCard from "@/features/payments/components/PaymentMethodCard";
import PaymentPolicyCard from "@/features/payments/components/PaymentPolicyCard";
import PaymentSummaryCard from "@/features/payments/components/PaymentSummaryCard";
import PaymentVehicleCard from "@/features/payments/components/PaymentVehicleCard";
import { Spinner } from "@repo/ui/components/ui/spinner";

import { useProfile } from "@/features/auth/hooks/useProfile";
import { useVehicle } from "@repo/hooks";
import {
  useBooking,
  useVehicleReturnByBookingId,
} from "@/features/bookings/hooks/queries";

import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type { PaymentMethod } from "@repo/schemas";

import { useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/components/ui/button";
import { useCancelBooking } from "@/features/bookings/hooks/mutations";
import { toast } from "@repo/ui/components/ui/sonner";
import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentType =
    searchParams.get("type") === "surcharge" ? "surcharge" : "booking";

  const { data: userProfile, isLoading: profileLoading } = useProfile();
  const { data: booking, isLoading: bookingLoading } = useBooking(id!);
  const { data: vehicleReturn, isLoading: returnLoading } =
    useVehicleReturnByBookingId(id!, { enabled: paymentType === "surcharge" });
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(
    booking?.vehicleId || "",
  );

  // 🌟 KHỞI TẠO HOOK HỦY ĐƠN
  const { mutate: cancelBooking, isPending: isCanceling } = useCancelBooking();

  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("vnpay");

  const handleCancelBooking = () => {
    if (!id) return;

    cancelBooking(id, {
      onSuccess: () => {
        toast.success("Booking has been canceled successfully.");
        navigate("/my-bookings");
      },
    });
  };

  const isPageLoading =
    profileLoading ||
    bookingLoading ||
    (booking && vehicleLoading) ||
    (paymentType === "surcharge" && returnLoading);

  if (isPageLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!booking || (paymentType === "surcharge" && !vehicleReturn)) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-sm font-medium text-muted-foreground">
        {paymentType === "surcharge"
          ? "Surcharge invoice details could not be found."
          : "Booking information could not be found."}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <PaymentHeader type={paymentType} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <PaymentCustomerCard user={userProfile} />
            <PaymentVehicleCard vehicle={vehicle} />
            <PaymentBookingCard booking={booking} />
            <PaymentMethodCard
              selectedMethod={selectedMethod}
              onMethodSelect={setSelectedMethod}
            />
            <PaymentPolicyCard />

            {/* 🌟 KHU VỰC HỦY ĐƠN TINH TẾ (Chỉ hiển thị khi đang trong luồng đặt xe mới và đơn có thể huỷ) */}
            {paymentType === "booking" && booking.status === "pending" && (
              <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                <p className="text-sm font-medium uppercase tracking-wider text-primary">
                  Need to cancel?
                </p>

                <div className="space-y-2 flex">
                  <p className="text-sm text-muted-foreground">
                    If you change your mind, you can cancel your booking before
                    the payment is completed. Please note that cancellation may
                    be subject to our cancellation policy.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setOpenCancelDialog(true)}
                  >
                    Cancel Booking
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div>
            <PaymentSummaryCard
              booking={booking}
              selectedMethod={selectedMethod}
              paymentType={paymentType}
              vehicleReturn={vehicleReturn}
            />
          </div>
        </div>
      </div>
      <UniversalDialog
        trigger={null}
        type="confirm"
        variant="destructive"
        open={openCancelDialog}
        onOpenChange={setOpenCancelDialog}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking and stop payment?"
        onSubmit={handleCancelBooking}
        submitLabel="Yes, Cancel Booking"
        loading={isCanceling}
      />
    </main>
  );
}
