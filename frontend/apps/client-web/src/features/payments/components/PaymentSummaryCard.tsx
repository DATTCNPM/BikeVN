import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReceiptText } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";

import type {
  Booking,
  PaymentCreationPayload,
  PaymentMethod,
} from "@repo/types";

import { useCreatePayment } from "@/features/payments/mutations";

import PaymentConfirmDialog from "./PaymentConfirmDialog";

type Props = {
  booking: Booking | null;
  selectedMethod: PaymentMethod;
};

export default function PaymentSummaryCard({ booking, selectedMethod }: Props) {
  const navigate = useNavigate();

  const { mutate: createPayment, isPending } = useCreatePayment();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const transactionCode = "MOCK_TRANSACTION_CODE";

  const handlePayment = () => {
    if (!booking) return;

    const payload: PaymentCreationPayload = {
      bookingId: booking.id,
      amount: booking.totalPrice || 0,
      idempotencyKey: crypto.randomUUID(),
      paymentMethod: selectedMethod,
    };

    createPayment(payload, {
      onSuccess: () => {
        setConfirmOpen(true);
      },
    });
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
          <SummaryItem label="Rental Price" value={booking?.totalPrice || 0} />

          <SummaryItem
            label="Deposit"
            value={booking?.totalPrice ? booking.totalPrice * 0.2 : 0}
          />

          <SummaryItem
            label="Service Fee"
            value={booking?.totalPrice ? booking.totalPrice * 0.1 : 0}
          />

          <div className="border-t border-dashed border-border pt-5">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Total</p>

              <p className="text-3xl font-black tracking-tight text-primary">
                {booking?.totalPrice?.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        </div>

        <Button
          disabled={!booking || isPending}
          onClick={handlePayment}
          className="mt-8 h-14 w-full rounded-2xl text-base font-bold"
        >
          {isPending ? "Đang tạo thanh toán..." : "Thanh toán ngay"}
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          By continuing, you agree to the terms and conditions of the system.
        </p>
      </Card>

      {booking && (
        <PaymentConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          bookingId={booking.id}
          transactionCode={transactionCode}
          onSuccess={() => {
            navigate(`/payment-result/${booking.id}`);
          }}
        />
      )}
    </>
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
