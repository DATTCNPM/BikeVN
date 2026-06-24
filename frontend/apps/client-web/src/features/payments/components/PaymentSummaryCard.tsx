import { ReceiptText } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import type {
  Booking,
  PaymentCreationPayload,
  PaymentMethod,
} from "@repo/types";
import {
  useCreatePayment,
  useGetVNPayUrl,
} from "@/features/payments/mutations";

type Props = {
  booking: Booking | null;
  selectedMethod: PaymentMethod;
};

export default function PaymentSummaryCard({ booking, selectedMethod }: Props) {
  const { mutate: createPayment, isPending: isCreating } = useCreatePayment();
  const { mutate: getVNPayUrl, isPending: isGettingUrl } = useGetVNPayUrl();

  const handlePayment = () => {
    if (!booking) return;

    const payload: PaymentCreationPayload = {
      bookingId: booking.id,
      amount: booking.totalPrice || 0,
      idempotencyKey: crypto.randomUUID(),
      paymentMethod: selectedMethod,
    };

    // Chuỗi xử lý liên hoàn kích hoạt link VNPay sau khi lưu DB thành công
    createPayment(payload, {
      onSuccess: (paymentData) => {
        if (paymentData?.id) {
          getVNPayUrl(paymentData.id);
          // Note: Hook useGetVNPayUrl đã có logic window.location.href = vnpayUrl khi thành công
        }
      },
    });
  };

  // Tránh tính toán trực tiếp trong phần return JSX
  const basePrice = booking?.totalPrice || 0;
  const depositPrice = basePrice * 0.2;
  const serviceFee = basePrice * 0.1;

  // Trạng thái loading tổng hợp của nút bấm
  const isLoading = isCreating || isGettingUrl;
  const buttonText = isCreating
    ? "Đang khởi tạo đơn hàng..."
    : isGettingUrl
      ? "Đang chuyển hướng đến VNPay..."
      : "Thanh toán ngay";

  return (
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
              {basePrice.toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>
      </div>

      <Button
        disabled={!booking || isLoading}
        onClick={handlePayment}
        className="mt-8 h-14 w-full rounded-2xl text-base font-bold"
      >
        {buttonText}
      </Button>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        By continuing, you agree to the terms and conditions of the system.
      </p>
    </Card>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold">{value.toLocaleString("vi-VN")}đ</p>
    </div>
  );
}
