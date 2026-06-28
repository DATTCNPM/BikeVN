// components/payment/PaymentSummaryCard.tsx
import { useState } from "react";
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

type Props = {
  booking: Booking | null;
  selectedMethod: PaymentMethod;
  userProfile: User | undefined;
};

const formatVND = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

export default function PaymentSummaryCard({
  booking,
  selectedMethod,
  userProfile,
}: Props) {
  const { mutate: createPayment, isPending: isCreating } = useCreatePayment();
  const { mutate: getVNPayUrl, isPending: isGettingUrl } = useGetVNPayUrl();

  const [modalOpen, setModalOpen] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const handlePayment = () => {
    if (!booking) return;

    const missing: string[] = [];
    if (!userProfile?.phone) missing.push("Số điện thoại");
    if (!userProfile?.cccdNumber) missing.push("Căn cước công dân (CCCD)");

    if (missing.length > 0) {
      setMissingFields(missing);
      setModalOpen(true);
      return;
    }

    const payload: PaymentCreationPayload = {
      bookingId: booking.id,
      amount: booking.totalPrice || 0,
      idempotencyKey: crypto.randomUUID(),
      paymentMethod: selectedMethod,
    };

    createPayment(payload, {
      onSuccess: (paymentData) => {
        // TỐI ƯU: Đảm bảo bóc tách an toàn id của đơn hàng vừa tạo để xin URL từ VNPay
        const paymentId = paymentData?.id;
        if (paymentId) {
          getVNPayUrl(paymentId);
        }
      },
    });
  };

  const basePrice = booking?.totalPrice || 0;
  const depositPrice = basePrice * 0.2;
  const serviceFee = basePrice * 0.1;

  const isLoading = isCreating || isGettingUrl;

  const getButtonText = () => {
    if (isCreating) return "Đang khởi tạo đơn hàng...";
    if (isGettingUrl) return "Đang chuyển hướng đến VNPay...";
    return "Thanh toán ngay";
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
          <SummaryItem label="Rental Price" value={basePrice} />
          <SummaryItem label="Deposit (20%)" value={depositPrice} />
          <SummaryItem label="Service Fee (10%)" value={serviceFee} />

          <div className="border-t border-dashed border-border pt-5">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Total</p>
              <p className="text-3xl font-black tracking-tight text-primary">
                {formatVND(basePrice)}
              </p>
            </div>
          </div>
        </div>

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
