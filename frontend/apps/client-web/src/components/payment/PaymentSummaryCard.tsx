import { useNavigate } from "react-router-dom";

import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { ReceiptText } from "lucide-react";
import type { Booking } from "@repo/types";
import type { PaymentMethod } from "@repo/types";
import type { CreatePaymentPayload } from "@repo/api";

import { useCreatePayment } from "@/hooks/usePayment";

type Props = {
  booking: Booking | undefined;
  selectedMethod: PaymentMethod;
};

export default function PaymentSummaryCard({ booking, selectedMethod }: Props) {
  const navigate = useNavigate();
  const { mutate: createPayment } = useCreatePayment();

  const handlePayment = async () => {
    if (!booking) return;
    const payload: CreatePaymentPayload = {
      booking_id: booking.id,
      amount: booking.total_price,
      type: "rental",
      card_method: selectedMethod,
      payment_method: selectedMethod,
    };
    createPayment(
      {
        ...payload,
      },
      {
        onSuccess() {
          navigate(`/booking-result/${booking?.id}`);
        },
      },
    );
  };

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

          <h2 className="text-2xl font-bold">Chi tiết thanh toán</h2>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <SummaryItem label="Rental Price" value={booking?.total_price || 0} />

        <SummaryItem
          label="Deposit"
          value={booking?.total_price ? booking.total_price * 0.2 : 0}
        />

        <SummaryItem
          label="Service Fee"
          value={booking?.total_price ? booking.total_price * 0.1 : 0}
        />

        <div className="border-t border-dashed border-border pt-5">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Total</p>

            <p className="text-3xl font-black tracking-tight text-primary">
              {booking?.total_price.toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={handlePayment}
        className="mt-8 h-14 w-full rounded-2xl text-base font-bold"
      >
        Thanh toán ngay
      </Button>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Bằng việc tiếp tục, bạn đồng ý với điều khoản và chính sách của hệ
        thống.
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
