// components/booking/BookingActions.tsx
import { Button } from "@repo/ui/components/ui/button";
import { ArrowRight, Bike, ClipboardList, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCancelBooking } from "@/features/bookings/mutations"; // Điều chỉnh đường dẫn import hook của bạn
import { toast } from "@repo/ui/components/ui/sonner";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";
import { useState } from "react";

type Props = {
  bookingId?: string;
  status?: string;
};

export default function BookingActions({ bookingId, status }: Props) {
  const navigate = useNavigate();
  const { mutate: cancelBooking, isPending } = useCancelBooking();
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const handleCancel = () => {
    if (!bookingId) return;

    // Thêm confirm nhanh bằng trình duyệt trước khi hủy

    cancelBooking(bookingId, {
      onSuccess: () => {
        toast.success("Booking canceled successfully");
        navigate("/my-bookings");
      },
    });
  };

  // Chỉ cho phép hủy nếu đơn hàng ở trạng thái chờ xử lý hoặc đã xác nhận
  const canCancel = status === "pending" || status === "confirmed";

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
          Contact Support
          <ArrowRight className="ml-2 size-5" />
        </Button>

        {/* 🌟 NÚT HỦY ĐƠN HÀNG TINH TẾ */}
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
    </aside>
  );
}
