import PaymentBookingCard from "@/components/payment/PaymentBookingCard";
import PaymentCustomerCard from "@/components/payment/PaymentCustomerCard";
import PaymentHeader from "@/components/payment/PaymentHeader";
import PaymentMethodCard from "@/components/payment/PaymentMethodCard";
import PaymentPolicyCard from "@/components/payment/PaymentPolicyCard";
import PaymentSummaryCard from "@/components/payment/PaymentSummaryCard";
import PaymentVehicleCard from "@/components/payment/PaymentVehicleCard";

import { booking } from "@/constants/BookingSample";
import { paymentMethods } from "@/constants/PaymentSample";

import { useAuthStore } from "@/stores/useAuthStore";
import { useVehicleStore } from "@/stores/useVehicleStore";

import { useEffect } from "react";

export default function PaymentPage() {
  const { userProfile } = useAuthStore();
  const { vehicles, fetchVehicles } = useVehicleStore();
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const bookingData = booking[0]; // Lấy booking đầu tiên làm ví dụ
  const vehicleData = vehicles.find((v) => v.id === bookingData.vehicle_id);

  const dataPayment = {
    booking: bookingData,
    vehicle: vehicleData ? vehicleData : undefined,
    user: userProfile ? userProfile : undefined,
    paymentMethod: paymentMethods[0], // Lấy phương thức thanh toán đầu tiên làm ví dụ
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <PaymentHeader />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <PaymentCustomerCard user={dataPayment.user} />

            <PaymentVehicleCard vehicle={dataPayment.vehicle} />

            <PaymentBookingCard booking={dataPayment.booking} />

            <PaymentMethodCard />

            <PaymentPolicyCard />
          </div>

          <div>
            <PaymentSummaryCard
              booking={dataPayment.booking}
              paymentMethod={dataPayment.paymentMethod}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
