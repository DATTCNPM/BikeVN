import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Home,
  RefreshCw,
} from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { toast } from "@repo/ui/components/ui/sonner";
// Import hook vừa tạo thay vì import trực tiếp api client
import { useVerifyVNPayCallback } from "@/features/payments/hooks/queries";

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Chuyển đổi toàn bộ tham số VNPay trả về thành Object
  const queryParams = Object.fromEntries(searchParams.entries());

  const paymentId = queryParams["vnp_TxnRef"] || "";
  const responseCode = queryParams["vnp_ResponseCode"];
  const transactionCode = queryParams["vnp_TransactionNo"] || "N/A";
  const amountRaw = queryParams["vnp_Amount"];
  const amount = amountRaw ? Number(amountRaw) / 100 : 0;

  // Sử dụng custom hook gọn sạch
  const {
    data: verifyResult,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useVerifyVNPayCallback(queryParams, paymentId);

  const handleRefreshStatus = async () => {
    const { data } = await refetch();
    if (data === "SUCCESS") {
      toast.success("Transaction updated! Payment completed successfully.");
    } else if (data === "FAILED") {
      toast.error("Transaction verification failed on gateway.");
    } else {
      toast.info("Transaction status has not changed.");
    }
  };

  if (isLoading || isRefetching) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <Spinner />
        <p className="text-muted-foreground animate-pulse font-medium">
          Verifying secure signature with payment gateway...
        </p>
      </div>
    );
  }

  // LOGIC ĐÁNH GIÁ TRẠNG THÁI CUỐI CÙNG
  let statusKey: "completed" | "failed" | "pending" = "pending";

  if (error || verifyResult === "FAILED") {
    statusKey = "failed";
  } else if (verifyResult === "SUCCESS") {
    statusKey = "completed";
  } else if (responseCode === "00") {
    statusKey = "pending";
  } else {
    statusKey = "failed";
  }

  const PAYMENT_STATUS_CONFIG = {
    completed: {
      icon: <CheckCircle2 className="size-12 text-emerald-500" />,
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      title: "Payment Successful!",
      description:
        "Your payment has been successfully processed by VNPay. Your ride is now ready.",
    },
    failed: {
      icon: <XCircle className="size-12 text-destructive" />,
      bg: "bg-destructive/10",
      title: "Payment Failed",
      description:
        verifyResult === "FAILED"
          ? "The transaction was marked as failed by system verification."
          : "The transaction was canceled or signature validation failed. Please try again.",
    },
    pending: {
      icon: <RefreshCw className="size-12 text-amber-500 animate-spin" />,
      bg: "bg-amber-50 dark:bg-amber-500/10",
      title: "Payment Pending",
      description:
        "Response from the gateway is taking longer than expected. Click refresh to sync.",
    },
  };

  const currentStatus = PAYMENT_STATUS_CONFIG[statusKey];

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-lg rounded-[2.5rem] border-border p-8 shadow-sm bg-card">
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

        <div className="mt-8 rounded-2xl bg-muted/50 p-5 space-y-4 text-sm">
          <div className="flex justify-between items-center border-b border-border border-dashed pb-3">
            <span className="text-muted-foreground">Payment ID</span>
            <span className="font-mono font-medium text-foreground">
              {paymentId || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-border border-dashed pb-3">
            <span className="text-muted-foreground">Transaction Code</span>
            <span className="font-mono font-medium text-foreground">
              {transactionCode}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-border border-dashed pb-3">
            <span className="text-muted-foreground">Gateway</span>
            <span className="font-semibold uppercase text-primary">VNPay</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-muted-foreground text-base">
              Total Amount
            </span>
            <span className="text-xl font-black text-primary">
              {amount.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {statusKey === "pending" ? (
            <Button
              onClick={handleRefreshStatus}
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
            onClick={() => navigate(`/my-bookings`)}
            className="w-full rounded-2xl h-12 font-bold shadow-sm"
          >
            My Bookings
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </Card>
    </main>
  );
}
