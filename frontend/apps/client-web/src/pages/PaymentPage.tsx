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
import { useParams, useSearchParams } from "react-router-dom";
import type { PaymentMethod } from "@repo/types";

export default function PaymentPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  // 🌟 LẤY LOẠI THANH TOÁN: "booking" (mặc định) hoặc "surcharge"
  const paymentType =
    searchParams.get("type") === "surcharge" ? "surcharge" : "booking";

  const { data: userProfile, isLoading: profileLoading } = useProfile();
  const { data: booking = null, isLoading } = useBooking(id!);
  const { data: vehicle = null, isLoading: vehicleLoading } = useVehicle(
    booking?.vehicleId || "",
  );

  // 🟢 THÊM: Nếu là surcharge, có thể bạn cần fetch thêm data của biên bản trả xe để lấy giá tiền phạt chính xác
  // const { data: vehicleReturn } = useVehicleReturnByBookingId(id!);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("vnpay");

  if (isLoading || vehicleLoading || profileLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  console.log(
    "🚀 ~ file: PaymentPage.tsx:38 ~ PaymentPage ~ booking:",
    booking,
  );
  console.log(
    "🚀 ~ file: PaymentPage.tsx:39 ~ PaymentPage ~ paymentType:",
    paymentType,
  );

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        {/* Truyền paymentType xuống để đổi chữ tiêu đề nếu cần */}
        <PaymentHeader type={paymentType} />

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
            {/* 🌟 TRUYỀN THÊM LOẠI THANH TOÁN XUỐNG SUMMARY CARD */}
            <PaymentSummaryCard
              booking={booking || null}
              selectedMethod={selectedMethod}
              userProfile={userProfile}
              paymentType={paymentType} // <--- Thêm ở đây
            />
          </div>
        </div>
      </div>
    </main>
  );
}
