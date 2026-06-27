import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Home,
  RefreshCw,
} from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { usePayment } from "@/features/payments/queries";

// 1. Di chuyển cấu hình trạng thái ra ngoài Component để tránh re-create khi render
const PAYMENT_STATUS_CONFIG = {
  completed: {
    icon: <CheckCircle2 className="size-12 text-emerald-500" />,
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    title: "Payment Successful!",
    description:
      "Your payment has been successfully processed. Your ride is now ready.",
  },
  failed: {
    icon: <XCircle className="size-12 text-destructive" />,
    bg: "bg-destructive/10",
    title: "Payment Failed",
    description:
      "The transaction was canceled or declined by the bank. Please try again.",
  },
  pending: {
    icon: <RefreshCw className="size-12 text-amber-500 animate-spin" />,
    bg: "bg-amber-50 dark:bg-amber-500/10",
    title: "Payment Pending",
    description:
      "Response from the gateway might be delayed. Please click refresh to update status.",
  },
  refunded: {
    icon: <AlertTriangle className="size-12 text-blue-500" />,
    bg: "bg-blue-50 dark:bg-blue-500/10",
    title: "Payment Refunded",
    description:
      "This transaction has been refunded to your account by the administrator.",
  },
} as const;

type PaymentStatus = keyof typeof PAYMENT_STATUS_CONFIG;

export default function PaymentResultPage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();

  const {
    data: payment,
    isLoading,
    error,
    refetch,
  } = usePayment(paymentId ?? "");

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <Spinner />
        <p className="text-muted-foreground animate-pulse font-medium">
          Verifying transaction with the bank...
        </p>
      </div>
    );
  }

  // ERROR OR NOT FOUND STATE
  if (error || !payment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md rounded-[2rem] border-border p-8 text-center shadow-lg">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            Transaction Not Found
          </h1>
          <p className="mt-2 text-muted-foreground">
            An error occurred or the payment reference does not exist in our
            system.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="mt-8 w-full rounded-2xl h-12 font-semibold"
          >
            Back to Home
          </Button>
        </Card>
      </main>
    );
  }

  // Khớp trạng thái an toàn với Type Guard fallback
  const statusKey = (
    payment.status in PAYMENT_STATUS_CONFIG ? payment.status : "pending"
  ) as PaymentStatus;
  const currentStatus = PAYMENT_STATUS_CONFIG[statusKey];

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-lg rounded-[2.5rem] border-border p-8 shadow-sm bg-card">
        {/* Status Header */}
        <div className="text-center">
          <div
            className={`mx-auto flex size-24 items-center justify-center rounded-3xl ${currentStatus.bg}`}
          >
            {currentStatus.icon}
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-foreground">
            {currentStatus.title}
          </h1>
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed px-4">
            {currentStatus.description}
          </p>
        </div>

        {/* Invoice Details */}
        <div className="mt-8 rounded-2xl bg-muted/50 p-5 space-y-4 text-sm">
          <div className="flex justify-between items-center border-b border-border border-dashed pb-3">
            <span className="text-muted-foreground">Payment ID</span>
            <span className="font-mono font-medium text-foreground">
              {payment.id}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-border border-dashed pb-3">
            <span className="text-muted-foreground">Transaction Code</span>
            <span className="font-mono font-medium text-foreground">
              {payment.transactionCode || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-border border-dashed pb-3">
            <span className="text-muted-foreground">Method</span>
            <span className="font-semibold uppercase text-primary">
              {payment.paymentMethod}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-muted-foreground text-base">
              Total Amount
            </span>
            <span className="text-xl font-black text-primary">
              {(payment.amount ?? 0).toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {statusKey === "pending" ? (
            <Button
              onClick={() => void refetch()}
              variant="outline"
              className="w-full rounded-2xl h-12 font-bold group border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-500/10"
            >
              <RefreshCw className="mr-2 size-4 group-hover:animate-spin" />
              Refresh Status
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full rounded-2xl h-12 font-bold text-muted-foreground"
            >
              <Home className="mr-2 size-4" />
              Back to Home
            </Button>
          )}

          <Button
            onClick={() => navigate(`/bookings/${payment.bookingId}`)}
            className="w-full rounded-2xl h-12 font-bold shadow-sm"
          >
            Booking Details
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </Card>
    </main>
  );
}
