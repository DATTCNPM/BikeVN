import PaymentBookingCard from "@/components/payment/PaymentBookingCard";
import PaymentCustomerCard from "@/components/payment/PaymentCustomerCard";
import PaymentHeader from "@/components/payment/PaymentHeader";
import PaymentMethodCard from "@/components/payment/PaymentMethodCard";
import PaymentPolicyCard from "@/components/payment/PaymentPolicyCard";
import PaymentSummaryCard from "@/components/payment/PaymentSummaryCard";
import PaymentVehicleCard from "@/components/payment/PaymentVehicleCard";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { toast } from "sonner";

import { useProfile } from "@/features/auth/useProfile";
import { useBooking } from "@repo/hooks";

import { useEffect, useState } from "react";
import { useVehicle } from "@repo/hooks";
import { useParams } from "react-router-dom";
import type { PaymentMethod } from "node_modules/@repo/types/src/payment";

export default function PaymentPage() {
  const {
    data: userProfile,
    isLoading: profileLoading,
    error: profileError,
  } = useProfile();
  const { id } = useParams();
  const { data: booking = null, isLoading, error } = useBooking(id!);
  const {
    data: vehicle = null,
    isLoading: vehicleLoading,
    error: vehicleError,
  } = useVehicle(booking?.vehicle_id || "");

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("vnpay");

  useEffect(() => {
    if (error) {
      toast.error("Failed to load booking details. Please try again.");
    }
    if (vehicleError) {
      toast.error("Failed to load vehicle details. Please try again.");
    }
    if (profileError) {
      toast.error("Failed to load user profile. Please try again.");
    }
  }, [error, vehicleError, profileError]);

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
