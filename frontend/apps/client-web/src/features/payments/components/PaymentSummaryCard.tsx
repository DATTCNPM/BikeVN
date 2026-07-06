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
  VehicleReturn,
} from "@repo/types";
import { toast } from "@repo/ui/components/ui/sonner";

type Props = {
  booking: Booking | null;
  vehicleReturn?: VehicleReturn | null; // 🌟 Nhận dữ liệu biên bản trả xe
  selectedMethod: PaymentMethod;
  userProfile: User | undefined;
  paymentType: "booking" | "surcharge";
  surchargeAmount?: number; // Có thể dùng prop này hoặc đọc trực tiếp từ vehicleReturn
};

const formatVND = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

export default function PaymentSummaryCard({
  booking,
  vehicleReturn,
  selectedMethod,
  userProfile,
  paymentType,
  surchargeAmount,
}: Props) {
  const navigate = useNavigate();
  const { mutate: createPayment, isPending: isCreating } = useCreatePayment();
  const { mutate: getVNPayUrl, isPending: isGettingUrl } = useGetVNPayUrl();

  const [modalOpen, setModalOpen] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // 🌟 KHẮC PHỤC LỖI BIẾN 'data': Xác định nguồn tiền chuẩn xác
  // Ưu tiên lấy từ surchargeAmount (trang cha tính toán), nếu ko có thì tự lấy từ vehicleReturn?.extraFee
  const finalPrice =
    paymentType === "surcharge"
      ? (surchargeAmount ?? vehicleReturn?.extraFee ?? 0)
      : booking?.totalPrice || 0;

  const isLoading = isCreating || isGettingUrl;

  // Kiểm tra xem đã có đủ dữ liệu gốc để tiến hành thanh toán chưa
  const hasRequiredData = booking !== null;

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
      bookingId: booking.id, // 🌟 Sửa từ data.id thành booking.id
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
          navigate(`/booking-result/${booking.id}`); // 🌟 Sửa từ data.id thành booking.id
        } else if (selectedMethod === "vnpay") {
          const bookingId =
            paymentType === "surcharge"
              ? vehicleReturn?.payment?.bookingId
              : booking.id;
          const returnUrl = `${window.location.origin}/booking-result/${bookingId}?payment=success`; // 🌟 Sửa từ data.id thành booking.id
          getVNPayUrl({ paymentId, returnUrl });
        }
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
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

  console.log("booking in PaymentSummaryCard:", booking);
  console.log("vehicleReturn in PaymentSummaryCard:", vehicleReturn);
  console.log("finalPrice in PaymentSummaryCard:", finalPrice);

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
          disabled={!hasRequiredData || isLoading} // 🌟 Sửa logic disabled dựa trên booking trạng thái
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
