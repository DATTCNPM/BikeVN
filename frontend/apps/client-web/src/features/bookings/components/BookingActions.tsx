// components/booking/BookingActions.tsx
import { Button } from "@repo/ui/components/ui/button";
import {
  ArrowRight,
  Bike,
  ClipboardList,
  Trash2,
  RefreshCw,
  SidebarOpen,
} from "lucide-react"; // Thêm icon RefreshCw
import { useNavigate } from "react-router-dom";
import { useCancelBooking } from "@/features/bookings/hooks/mutations";
import { useClientRetryPayment } from "@/features/payments/hooks/mutations"; // Import hook retry của client đã tạo ở bước trước
import { toast } from "@repo/ui/components/ui/sonner";
import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";
import { useState } from "react";

import { useGetVNPayUrl } from "@/features/payments/hooks/mutations"; // Thêm useGetVNPayUrl

type Props = {
  bookingId?: string;
  status?: string;
  // 🌟 THÊM PROPS: Để quản lý thông tin thanh toán phía Client
  paymentId?: string;
  paymentStatus?: string;
};

export default function BookingActions({
  bookingId,
  status,
  paymentId,
  paymentStatus,
}: Props) {
  const navigate = useNavigate();
  const { mutate: cancelBooking, isPending } = useCancelBooking();
  const { mutate: retryPayment, isPending: isRetrying } =
    useClientRetryPayment(); // Hook xử lý retry

  // 🌟 THÊM HOOK LẤY LINK VNPAY
  const { mutate: getVNPayUrl, isPending: isGettingUrl } = useGetVNPayUrl();

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openRetryDialog, setOpenRetryDialog] = useState(false);

  const handleCancel = () => {
    if (!bookingId) return;
    cancelBooking(bookingId, {
      onSuccess: () => {
        toast.success("Booking canceled successfully");
        navigate("/my-bookings");
      },
    });
  };

  // 1. Tạo một hàm helper lấy text hoặc dùng biến trực tiếp trên render:
  const getRetryButtonText = () => {
    if (isRetrying) return "Updating payment...";
    if (isGettingUrl) return "Redirecting to VNPay...";
    return "Retry Payment";
  };

  const isProcessingPayment = isRetrying || isGettingUrl;

  // 🌟 THÊM MỚI: Xử lý hành động bấm Thử lại thanh toán
  const handleRetry = () => {
    if (!paymentId) return;

    retryPayment(
      { id: paymentId, newPaymentMethod: "bank_transfer" },
      {
        onSuccess: () => {
          setOpenRetryDialog(false);
          const returnUrl = `${window.location.origin}/booking-result/${bookingId}?payment=success`;
          getVNPayUrl({ paymentId, returnUrl });
        },
      },
    );
  };

  // Logic hiển thị nút
  const canCancel = status === "pending" || status === "confirmed";

  // 🌟 THÊM MỚI LOGIC: Client hiển thị nút Retry nếu thanh toán bị pending hoặc failed
  const canRetry =
    paymentId && (paymentStatus === "pending" || paymentStatus === "failed");

  return (
    <aside className="h-fit rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wider text-primary">
        Actions
      </p>
      <h2 className="mt-2 text-2xl font-bold">What's Next?</h2>

      <div className="mt-6 flex flex-col gap-4">
        <Button
          size="lg"
          className="h-12 rounded-2xl"
          onClick={() => navigate("/my-bookings")}
        >
          <ClipboardList className="mr-2 size-5" />
          My Booking
        </Button>

        <Button
          size="lg"
          variant="secondary"
          className="h-12 rounded-2xl"
          onClick={() => navigate("/home")}
        >
          <Bike className="mr-2 size-5" />
          Continue Browsing
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-12 rounded-2xl"
          onClick={() => navigate("/chat")}
        >
          <SidebarOpen className="mr-2 size-5" /> {/* Tùy biến icon liên hệ */}
          Contact Support
          <ArrowRight className="ml-2 size-5" />
        </Button>

        {/* 🌟 NÚT RETRY THANH TOÁN: Hiển thị nằm TRÊN nút Hủy */}
        {canRetry && (
          <Button
            size="lg"
            variant="default"
            disabled={isProcessingPayment}
            onClick={() => setOpenRetryDialog(true)}
            className="h-12 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm"
          >
            <RefreshCw
              className={`mr-2 size-5 ${isProcessingPayment ? "animate-spin" : ""}`}
            />
            {getRetryButtonText()} {/* Sử dụng hàm helper sạch sẽ ở đây */}
          </Button>
        )}

        {/* NÚT HỦY ĐƠN HÀNG TINH TẾ */}
        {canCancel && (
          <Button
            size="lg"
            variant="ghost"
            disabled={isPending}
            onClick={() => setOpenCancelDialog(true)}
            className="h-12 rounded-2xl text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 font-semibold"
          >
            <Trash2 className="mr-2 size-5" />
            {isPending ? "Canceling..." : "Cancel Booking"}
          </Button>
        )}
      </div>

      <div className="mt-8 rounded-2xl bg-primary/10 p-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Need help with your booking? Our support team is here to assist you
          with any questions or issues you may have.
        </p>
      </div>

      {/* Dialog xác nhận hủy */}
      <UniversalDialog
        trigger={null}
        type="confirm"
        variant="destructive"
        open={openCancelDialog}
        onOpenChange={setOpenCancelDialog}
        title="Confirm Cancellation"
        description="Are you sure you want to cancel this booking? This action cannot be undone."
        submitLabel="Yes, Cancel Booking"
        onSubmit={handleCancel}
      />

      {/* 🌟 THÊM MỚI: Dialog xác nhận Thử lại thanh toán */}
      <UniversalDialog
        trigger={null}
        type="confirm"
        variant="default"
        open={openRetryDialog}
        onOpenChange={setOpenRetryDialog}
        title="Retry Payment"
        description="You are changing your transaction request back to pending to complete the payment. Proceed?"
        submitLabel="Continue to Pay"
        onSubmit={handleRetry}
      />
    </aside>
  );
}
