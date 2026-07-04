import { useNavigate } from "react-router-dom";
import {
  Bike,
  CalendarDays,
  ChevronRight,
  Clock3,
  CircleCheckBig,
  CircleX,
} from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { useBookingsByUser } from "@/features/bookings/queries";
import { useProfile } from "@/features/profile/useProfile";
import { formatDateTime } from "@repo/utils";
import type { Booking } from "@repo/types";
import imageMock from "@/assets/images/motorbike1.png";

// Import các component trạng thái vừa tạo
import {
  BookingSkeleton,
  BookingEmptyState,
} from "@/features/bookings/components/BookingStates";

const statusConfig: Record<Booking["status"], any> = {
  pending: {
    label: "Pending",
    className:
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20",
    icon: Clock3,
  },
  approved: {
    label: "Approved",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20",
    icon: CircleCheckBig,
  },
  completed: {
    label: "Completed",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: CircleCheckBig,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: CircleX,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground border-border",
    icon: CircleX,
  },
};

type BookingWithVehicle = Booking & {
  vehicleName?: string;
  vehicleImage?: string;
};

export default function MyBookingPage() {
  const navigate = useNavigate();
  const { data: user } = useProfile();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookingsByUser(
    user?.id || "",
  );

  // 1. Xử lý trạng thái Loading mượt mà bằng Skeleton giả lập
  if (bookingsLoading) {
    return <BookingSkeleton />;
  }

  // 2. Xử lý trạng thái Không có dữ liệu với Giao diện rỗng cao cấp
  if (bookings.length === 0) {
    return <BookingEmptyState onExplore={() => navigate("/home")} />;
  }

  return (
    <div className="space-y-4 select-none">
      {(bookings as BookingWithVehicle[]).map((booking) => {
        const status = statusConfig[booking.status] || statusConfig.pending;
        const StatusIcon = status.icon;

        return (
          <Card
            key={booking.id}
            onClick={() => navigate(`/booking-result/${booking.id}`)}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5 flex flex-col sm:flex-row"
          >
            {/* KHU VỰC ẢNH XE */}
            <div className="relative h-44 sm:h-auto sm:w-[220px] shrink-0 overflow-hidden bg-muted/30">
              <img
                src={booking.vehicleImage || imageMock}
                alt={booking.vehicleName || "Vehicle"}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Badge tên xe lơ lửng trên ảnh cực nghệ */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md ring-1 ring-white/10 shadow-sm">
                <Bike className="size-3.5 text-amber-400" />
                {booking.vehicleName || "Vehicle"}
              </div>
            </div>

            {/* KHU VỰC THÔNG TIN */}
            <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
              {/* Top: ID & Thời gian & Badge Trạng thái */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5">
                  <span className="inline-block text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded-md">
                    ID: #{booking.id.slice(-8)}{" "}
                    {/* Rút gọn nếu ID quá dài để tránh vỡ khuôn */}
                  </span>

                  <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                    <CalendarDays className="size-4 text-primary shrink-0" />
                    <span className="tracking-tight">
                      {formatDateTime(booking.startTime)} →{" "}
                      {formatDateTime(booking.endTime)}
                    </span>
                  </div>
                </div>

                {/* Badge trạng thái bo gọn */}
                <Badge
                  className={`flex h-7 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold shadow-none self-start sm:self-auto ${status.className}`}
                >
                  <StatusIcon className="size-3.5 stroke-[2.2]" />
                  {status.label}
                </Badge>
              </div>

              {/* Bottom: Giá tiền & Nút hành động */}
              <div className="mt-5 flex items-end justify-between pt-3 border-t border-dashed border-border/80">
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
                    Total Price
                  </p>
                  <p className="text-xl font-black text-primary tracking-tight mt-0.5">
                    {booking.totalPrice?.toLocaleString("vi-VN")}
                    <span className="text-xs font-semibold ml-0.5">đ</span>
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1 text-xs font-semibold h-8 border-border/80 hover:bg-primary hover:text-primary-foreground group-hover:border-primary/20 transition-all"
                >
                  Details
                  <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
