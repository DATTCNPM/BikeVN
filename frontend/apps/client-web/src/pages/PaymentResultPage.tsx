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

export default function PaymentResultPage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();

  // Gọi API lấy trạng thái thanh toán mới nhất từ Backend (đã được VNPay IPN cập nhật)
  const {
    data: payment,
    isLoading,
    error,
    refetch,
  } = usePayment(paymentId || "");

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <Spinner />
        <p className="text-muted-foreground animate-pulse">
          Đang xác thực giao dịch với ngân hàng...
        </p>
      </div>
    );
  }

  // Trường hợp không tìm thấy đơn thanh toán hoặc lỗi hệ thống
  if (error || !payment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md rounded-[2rem] border-border p-8 text-center shadow-lg">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            Không tìm thấy giao dịch
          </h1>
          <p className="mt-2 text-muted-foreground">
            Đã có lỗi xảy ra hoặc mã hóa đơn thanh toán không tồn tại trên hệ
            thống.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="mt-8 w-full rounded-2xl h-12 font-semibold"
          >
            Quay lại trang chủ
          </Button>
        </Card>
      </main>
    );
  }

  // Cấu hình giao diện động dựa theo trạng thái đồng bộ từ Backend Enum
  const statusConfig = {
    completed: {
      icon: <CheckCircle2 className="size-12 text-emerald-500" />,
      bg: "bg-emerald-50",
      title: "Thanh toán thành công!",
      description:
        "Hệ thống đã ghi nhận khoản thanh toán của bạn. Chuyến đi của bạn đã được sẵn sàng kích hoạt.",
    },
    failed: {
      icon: <XCircle className="size-12 text-destructive" />,
      bg: "bg-destructive/10",
      title: "Thanh toán thất bại",
      description:
        "Giao dịch bị hủy bỏ hoặc không thành công từ phía ngân hàng. Vui lòng thử lại.",
    },
    pending: {
      icon: <RefreshCw className="size-12 text-amber-500 animate-spin" />,
      bg: "bg-amber-50",
      title: "Đang chờ xử lý",
      description:
        "Phản hồi từ cổng thanh toán có thể bị chậm quá 5 phút. Vui lòng nhấn cập nhật để kiểm tra.",
    },
    refunded: {
      icon: <AlertTriangle className="size-12 text-blue-500" />,
      bg: "bg-blue-50",
      title: "Đã hoàn tiền",
      description:
        "Hóa đơn này đã được Admin thực hiện hoàn trả tiền vào tài khoản của bạn.",
    },
  };

  const currentStatus = statusConfig[payment.status] || statusConfig.pending;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-lg rounded-[2.5rem] border-border p-8 shadow-sm bg-card">
        {/* Khu vực Trạng thái trạng thái trực quan */}
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

        {/* Thẻ thông tin chi tiết hóa đơn */}
        <div className="mt-8 rounded-2xl bg-muted/50 p-5 space-y-4 text-sm">
          <div className="flex justify-between items-center border-b border-border border-dashed pb-3">
            <span className="text-muted-foreground">Mã thanh toán (ID)</span>
            <span className="font-mono font-medium text-foreground">
              {payment.id}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-border border-dashed pb-3">
            <span className="text-muted-foreground">
              Mã giao dịch ngân hàng
            </span>
            <span className="font-mono font-medium text-foreground">
              {payment.transactionCode || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-border border-dashed pb-3">
            <span className="text-muted-foreground">Phương thức</span>
            <span className="font-semibold uppercase text-primary">
              {payment.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-muted-foreground text-base">
              Tổng số tiền
            </span>
            <span className="text-xl font-black text-primary">
              {payment.amount.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>

        {/* Khối điều hướng Actions */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {payment.status === "pending" ? (
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="w-full rounded-2xl h-12 font-bold group border-amber-200 hover:bg-amber-50"
            >
              <RefreshCw className="mr-2 size-4 group-hover:animate-spin" />
              Cập nhật lại
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full rounded-2xl h-12 font-bold text-muted-foreground"
            >
              <Home className="mr-2 size-4" />
              Về trang chủ
            </Button>
          )}

          <Button
            onClick={() => navigate(`/bookings/${payment.bookingId}`)}
            className="w-full rounded-2xl h-12 font-bold shadow-sm"
          >
            Chi tiết đơn thuê
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </Card>
    </main>
  );
}
