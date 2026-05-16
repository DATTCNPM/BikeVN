import PaymentBookingCard from "@/components/payment/PaymentBookingCard";
import PaymentCustomerCard from "@/components/payment/PaymentCustomerCard";
import PaymentHeader from "@/components/payment/PaymentHeader";
import PaymentMethodCard from "@/components/payment/PaymentMethodCard";
import PaymentPolicyCard from "@/components/payment/PaymentPolicyCard";
import PaymentSummaryCard from "@/components/payment/PaymentSummaryCard";
import PaymentVehicleCard from "@/components/payment/PaymentVehicleCard";
import { Spinner } from "@repo/ui/components/spinner";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/useAuthStore";
import { useBooking } from "@/hooks/useBooking";

import { useEffect, useState } from "react";
import { useVehicle } from "@/hooks/useVehicle";
import { useParams } from "react-router-dom";
import type { PaymentMethod } from "node_modules/@repo/types/src/payment";

export default function PaymentPage() {
  const { userProfile } = useAuthStore();
  const { id } = useParams();
  const { data: booking, isLoading, error } = useBooking(id!);
  const {
    data: vehicle,
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
  }, [error]);

  if (isLoading || vehicleLoading) {
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

            <PaymentVehicleCard vehicle={vehicle} />

            <PaymentBookingCard booking={booking} />

            <PaymentMethodCard
              selectedMethod={selectedMethod}
              onMethodSelect={setSelectedMethod}
            />

            <PaymentPolicyCard />
          </div>

          <div>
            <PaymentSummaryCard booking={booking} />
          </div>
        </div>
      </div>
    </main>
  );
}
