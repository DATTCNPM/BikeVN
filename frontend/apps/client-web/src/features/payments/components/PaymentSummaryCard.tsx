import { useNavigate } from "react-router-dom";
import { ReceiptText } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import {
  useCreatePayment,
  useGetVNPayUrl,
} from "@/features/payments/hooks/mutations";
import type {
  Booking,
  PaymentCreationPayload,
  PaymentMethod,
  VehicleReturn,
} from "@repo/schemas";
import { toast } from "@repo/ui/components/ui/sonner";
import { isApiError } from "@repo/api"; // 🌟 Import hàm kiểm tra lỗi từ API của hệ thống
import { ERROR_MESSAGES } from "@repo/providers"; // 🌟 Khai báo để lấy text chuẩn hóa theo code

type Props = {
  booking: Booking | null;
  vehicleReturn?: VehicleReturn | null;
  selectedMethod: PaymentMethod;

  paymentType: "booking" | "surcharge";
  surchargeAmount?: number;
};

const formatVND = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

export default function PaymentSummaryCard({
  booking,
  vehicleReturn,
  selectedMethod,
  paymentType,
  surchargeAmount,
}: Props) {
  console.log("booking", booking);
  console.log("payment type", paymentType);
  console.log(
    "🚀 ~ file: PaymentSummaryCard.tsx:34 ~ PaymentSummaryCard ~ vehicleReturn:",
    vehicleReturn,
  );
  const navigate = useNavigate();
  const { mutate: createPayment, isPending: isCreating } = useCreatePayment();
  const { mutate: getVNPayUrl, isPending: isGettingUrl } = useGetVNPayUrl();

  const finalPrice =
    paymentType === "surcharge"
      ? (surchargeAmount ?? vehicleReturn?.extraFee ?? 0)
      : booking?.totalPrice || 0;

  const isLoading = isCreating || isGettingUrl;
  const hasRequiredData = booking !== null;

  const handlePayment = () => {
    if (!booking) return;

    // =========================================================================
    // 🌟 LUỒNG 1: THANH TOÁN PHỤ PHÍ (SURCHARGE) - GIỐNG EXTRA FEEREMINDER
    // =========================================================================
    if (paymentType === "surcharge") {
      const pendingPayment = vehicleReturn?.payment;

      if (!pendingPayment?.id) {
        toast.error("Surcharge invoice payment data is missing.");
        return;
      }

      if (selectedMethod === "cash") {
        toast.success("Surcharge confirmed! Please pay at the counter.");
        navigate(`/booking-result/${booking.id}`);
      } else if (selectedMethod === "vnpay") {
        // Đồng bộ returnUrl quay về kết quả kèm param phân biệt
        const returnUrl = `${window.location.origin}/booking-result/${booking.id}?payment=success&type=surcharge`;

        // Gọi THẲNG hook lấy link VNPay bằng ID hóa đơn phạt có sẵn từ Backend
        getVNPayUrl({ paymentId: pendingPayment.id, returnUrl });
      }
      return; // 🛑 Bắt buộc có return để chặn không chạy xuống luồng tạo payment mới
    }

    // =========================================================================
    // 🌟 LUỒNG 2: THANH TOÁN TIỀN ĐẶT XE GỐC (BOOKING) - GIỮ NGUYÊN LOGIC CŨ
    // =========================================================================
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
          toast.success("Booking order created! Please pay at the counter.");
          navigate(`/booking-result/${booking.id}`);
        } else if (selectedMethod === "vnpay") {
          const returnUrl = `${window.location.origin}/booking-result/${booking.id}?payment=success`;
          getVNPayUrl({ paymentId, returnUrl });
        }
      },
      onError: (error: unknown) => {
        let message = "An unknown error occurred";
        if (isApiError(error)) {
          const errCode = error.code;
          if (errCode && ERROR_MESSAGES[errCode]) {
            message = ERROR_MESSAGES[errCode].message;
          } else {
            message = error.message || message;
          }
        } else if (error instanceof Error) {
          message = error.message;
        }
        toast.error(`Error: ${message}`);
      },
    });
  };

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
            <h2 className="text-2xl font-bold">
              {paymentType === "surcharge"
                ? "Surcharge Details"
                : "Payment Details"}
            </h2>
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

        <Button
          disabled={!hasRequiredData || isLoading}
          onClick={handlePayment}
          className="mt-8 h-14 w-full rounded-2xl text-base font-bold"
        >
          {getButtonText()}
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          By continuing, you agree to the terms and conditions of the system.
        </p>
      </Card>
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
