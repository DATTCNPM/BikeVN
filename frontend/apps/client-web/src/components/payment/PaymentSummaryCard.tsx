import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReceiptText } from "lucide-react";
import type { Booking } from "@/lib/types";
import type { PaymentMethod } from "@/lib/types";

type Props = {
  booking: Booking;
  paymentMethod: PaymentMethod;
};

export default function PaymentSummaryCard({ booking, paymentMethod }: Props) {
  const navigate = useNavigate();

  const handlePayment = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    navigate(`/booking-result/${booking.id}`);
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
        <SummaryItem label="Rental Price" value={paymentMethod.amount} />

        <SummaryItem label="Deposit" value={paymentMethod.amount * 0.2} />

        <SummaryItem label="Service Fee" value={paymentMethod.amount * 0.1} />

        <div className="border-t border-dashed border-border pt-5">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Total</p>

            <p className="text-3xl font-black tracking-tight text-primary">
              {paymentMethod.amount.toLocaleString("vi-VN")}đ
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
