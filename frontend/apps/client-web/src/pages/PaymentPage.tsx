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
import { useBooking } from "@/features/bookings/queries";

import { useState } from "react";
import { useParams } from "react-router-dom";
import type { PaymentMethod } from "@repo/types";

export default function PaymentPage() {
  const { data: userProfile, isLoading: profileLoading } = useProfile();
  const { id } = useParams();
  const { data: booking = null, isLoading } = useBooking(id!);
  const { data: vehicle = null, isLoading: vehicleLoading } = useVehicle(
    booking?.vehicleId || "",
  );

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("vnpay");

  if (isLoading || vehicleLoading || profileLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <PaymentHeader />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <PaymentCustomerCard user={userProfile} />

            <PaymentVehicleCard vehicle={vehicle || null} />

            <PaymentBookingCard booking={booking || null} />

            <PaymentMethodCard
              selectedMethod={selectedMethod}
              onMethodSelect={setSelectedMethod}
            />

            <PaymentPolicyCard />
          </div>

          <div>
            <PaymentSummaryCard
              booking={booking || null}
              selectedMethod={selectedMethod}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
