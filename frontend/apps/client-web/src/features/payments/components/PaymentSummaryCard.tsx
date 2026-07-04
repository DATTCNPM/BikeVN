// components/payment/PaymentSummaryCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReceiptText } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import {
  useCreatePayment,
  useGetVNPayUrl,
} from "@/features/payments/mutations";
import VerificationModal from "./VerificationModal";
import type {
  Booking,
  PaymentCreationPayload,
  PaymentMethod,
  User,
} from "@repo/types";
import { toast } from "@repo/ui/components/ui/sonner";

type Props = {
  booking: Booking | null;
  selectedMethod: PaymentMethod;
  userProfile: User | undefined;
  paymentType: "booking" | "surcharge";
  surchargeAmount?: number; // 🌟 THÊM: Truyền số tiền phạt chuẩn từ API trang cha xuống (nếu có)
};

const formatVND = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

export default function PaymentSummaryCard({
  booking,
  selectedMethod,
  userProfile,
  paymentType,
  surchargeAmount = 100000, // Fallback mặc định nếu không truyền
}: Props) {
  const navigate = useNavigate();
  const { mutate: createPayment, isPending: isCreating } = useCreatePayment();
  const { mutate: getVNPayUrl, isPending: isGettingUrl } = useGetVNPayUrl();

  const [modalOpen, setModalOpen] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // 🌟 Tính toán số tiền cuối cùng một cách an toàn
  const finalPrice =
    paymentType === "surcharge" ? surchargeAmount : booking?.totalPrice || 0;
  const isLoading = isCreating || isGettingUrl;

  const handlePayment = () => {
    if (!booking) return;

    const missing: string[] = [];
    if (!userProfile?.phone) missing.push("Phone Number");
    if (!userProfile?.cccdNumber) missing.push("National ID (CCCD)");

    if (missing.length > 0) {
      setMissingFields(missing);
      setModalOpen(true);
      return;
    }

    const payload: PaymentCreationPayload = {
      bookingId: booking.id,
      amount: finalPrice,
      idempotencyKey: crypto.randomUUID(),
      paymentMethod: selectedMethod,
    };

    createPayment(payload, {
      onSuccess: (paymentData) => {
        const paymentId = paymentData?.id;
        if (!paymentId) return;

        if (selectedMethod === "cash") {
          toast.success(
            paymentType === "surcharge"
              ? "Surcharge confirmed! Please pay at the counter."
              : "Booking order created! Please pay at the counter.",
          );
          navigate(`/booking-result/${booking.id}`);
        } else if (selectedMethod === "vnpay") {
          const returnUrl = `${window.location.origin}/booking-result/${booking.id}?payment=success`;
          getVNPayUrl({ paymentId, returnUrl });
        }
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    });
  };

  // 🌟 SỬA ĐỔI: Hàm trả về text chuẩn theo từng loại Context thanh toán
  const getButtonText = () => {
    if (isCreating) return "Processing...";
    if (isGettingUrl) return "Redirecting to VNPay...";

    if (paymentType === "surcharge") {
      return selectedMethod === "cash"
        ? "Confirm Surcharge"
        : "Pay Surcharge Now";
    }
    return selectedMethod === "cash" ? "Confirm Booking" : "Pay Now";
  };

  return (
    <>
      <Card className="sticky top-6 rounded-[2rem] border-border p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ReceiptText className="size-6" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Payment Summary
            </p>
            <h2 className="text-2xl font-bold">Payment Details</h2>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <SummaryItem
            label={
              paymentType === "surcharge"
                ? "Return Surcharge Penalty"
                : "Rental Price"
            }
            value={finalPrice}
          />

          <div className="border-t border-dashed border-border pt-5">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Total Due</p>
              <p className="text-3xl font-black tracking-tight text-primary">
                {formatVND(finalPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* 🌟 ĐƯA HÀM getButtonText() VÀO ĐÂY ĐỂ HIỂN THỊ CHUẨN */}
        <Button
          disabled={!booking || isLoading}
          onClick={handlePayment}
          className="mt-8 h-14 w-full rounded-2xl text-base font-bold"
        >
          {getButtonText()}
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          By continuing, you agree to the terms and conditions of the system.
        </p>
      </Card>

      <VerificationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        missingFields={missingFields}
      />
    </>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold">{formatVND(value)}</p>
    </div>
  );
}
