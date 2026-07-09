import PaymentBookingCard from "@/features/payments/components/PaymentBookingCard";
import PaymentCustomerCard from "@/features/payments/components/PaymentCustomerCard";
import PaymentHeader from "@/features/payments/components/PaymentHeader";
import PaymentMethodCard from "@/features/payments/components/PaymentMethodCard";
import PaymentPolicyCard from "@/features/payments/components/PaymentPolicyCard";
import PaymentSummaryCard from "@/features/payments/components/PaymentSummaryCard";
import PaymentVehicleCard from "@/features/payments/components/PaymentVehicleCard";
import { Spinner } from "@repo/ui/components/ui/spinner";

import { useProfile } from "@/features/profile/useProfile";
import { useVehicle } from "@repo/hooks";
import {
  useBooking,
  useVehicleReturnByBookingId,
} from "@/features/bookings/queries";

import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type { PaymentMethod } from "@repo/types";

export default function PaymentPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const paymentType =
    searchParams.get("type") === "surcharge" ? "surcharge" : "booking";

  // Các Hook lấy dữ liệu nguồn
  const { data: userProfile, isLoading: profileLoading } = useProfile();
  const { data: booking, isLoading: bookingLoading } = useBooking(id!);
  const { data: vehicleReturn, isLoading: returnLoading } =
    useVehicleReturnByBookingId(id!);
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(
    booking?.vehicleId || "",
  );

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("vnpay");

  // Gộp nhóm kiểm tra trạng thái Loading sạch sẽ
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

  // Chặn rách giao diện (UI Break) khi sai ID đơn hàng
  if (!booking) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-sm font-medium text-muted-foreground">
        Booking information could not be found.
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
          </div>

          <div>
            <PaymentSummaryCard
              booking={booking}
              selectedMethod={selectedMethod}
              userProfile={userProfile}
              paymentType={paymentType}
              vehicleReturn={vehicleReturn}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
