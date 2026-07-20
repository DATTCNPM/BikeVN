// features/bookings/components/ExtraFeeReminder.tsx
import { useState, useEffect } from "react";
import { AlertCircle, CreditCard, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog"; // Hoặc import đúng từ thư viện shadcn Dialog của bạn
import { Button } from "@repo/ui/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/ui/components/ui/alert";
import { useGetVNPayUrl } from "@/features/payments/hooks/mutations"; // Sử dụng mutation lấy URL VNPay cũ
import { toast } from "@repo/ui/components/ui/sonner";
import type { VehicleReturn } from "@repo/schemas"; // Import đúng kiểu VehicleReturn

type Props = {
  vehicleReturnData: VehicleReturn | null | undefined; // Type VehicleReturn chúng ta vừa update Schema ở câu trước
};

export default function ExtraFeeReminder({ vehicleReturnData }: Props) {
  // Chỉ kích hoạt nếu có thông tin phạt và trạng thái payment đi kèm là 'pending'
  const pendingPayment =
    vehicleReturnData?.payment?.status === "pending"
      ? vehicleReturnData.payment
      : null;
  const extraFeeAmount =
    vehicleReturnData?.extraFee || pendingPayment?.amount || 0;

  const [showDialog, setShowDialog] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const { mutate: getVNPayUrl, isPending: isRedirecting } = useGetVNPayUrl();

  useEffect(() => {
    if (pendingPayment && extraFeeAmount > 0) {
      setShowDialog(true);
      setShowBanner(true);
    }
  }, [pendingPayment, extraFeeAmount]);

  if (!pendingPayment || extraFeeAmount <= 0) return null;

  const handlePayment = () => {
    const returnUrl = `${window.location.origin}/payment-result`;
    getVNPayUrl(
      { paymentId: pendingPayment.id, returnUrl },
      {
        onError: (err) =>
          toast.error(`Payment redirection failed: ${err.message}`),
      },
    );
  };

  return (
    <>
      {/* 1. DIALOG NHẮC NHỞ TỰ ĐỘNG BẬT KHI VÀO TRANG */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-6">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
              <AlertCircle className="h-7 w-7" />
            </div>
            <DialogTitle className="text-xl font-bold text-destructive">
              Outstanding Extra Fee Detected
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              Your vehicle return process recorded some additional charges due
              to damages, delay, or fuel differences.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 rounded-2xl bg-muted p-4 text-center">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Amount Due
            </span>
            <p className="mt-1 text-3xl font-black tracking-tight text-destructive">
              {extraFeeAmount.toLocaleString("vi-VN")}đ
            </p>
            {pendingPayment.transferContent && (
              <p className="mt-2 text-xs font-mono text-muted-foreground bg-background/60 p-1.5 rounded border">
                Content: {pendingPayment.transferContent}
              </p>
            )}
          </div>

          <DialogFooter className="grid grid-cols-2 gap-3 sm:space-x-0">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="rounded-xl h-11"
            >
              Review Order
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isRedirecting}
              className="rounded-xl h-11 font-semibold gap-2 shadow-sm"
            >
              <CreditCard className="h-4 w-4" />
              {isRedirecting ? "Connecting..." : "Pay Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. BANNER CỐ ĐỊNH Ở LẠI TRÊN TRANG KHI USER ĐÓNG DIALOG */}
      {showBanner && (
        <Alert
          variant="destructive"
          className="relative rounded-2xl border-destructive/30 bg-destructive/5 p-4 pr-12 shadow-sm animate-in fade-in duration-300"
        >
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div className="ml-2">
            <AlertTitle className="font-bold text-destructive">
              Attention: Unpaid Damage/Extra Fee (
              {extraFeeAmount.toLocaleString("vi-VN")}đ)
            </AlertTitle>
            <AlertDescription className="mt-1 text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-3">
              <span>
                Please resolve this payment to clean your booking history.
              </span>
              <Button
                size="sm"
                onClick={handlePayment}
                disabled={isRedirecting}
                className="h-8 rounded-lg text-xs font-bold w-fit bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isRedirecting ? "Processing..." : "Pay Fine Now"}
              </Button>
            </AlertDescription>
          </div>
          {/* Nút nhỏ nếu họ muốn đóng luôn cả Banner ẩn đi tạm thời */}
          <button
            onClick={() => setShowBanner(false)}
            className="absolute top-4 right-4 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </Alert>
      )}
    </>
  );
}
