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

  if (bookingsLoading) return <BookingSkeleton />;
  if (bookings.length === 0) {
    return <BookingEmptyState onExplore={() => navigate("/home")} />;
  }

  return (
    // 🌟 THAY ĐỔI CHÍNH: Chuyển flex-col thành dạng lưới ô cờ linh hoạt theo độ rộng màn hình
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 select-none w-full max-w-7xl mx-auto p-1">
      {(bookings as BookingWithVehicle[]).map((booking) => {
        const status = statusConfig[booking.status] || statusConfig.pending;
        const StatusIcon = status.icon;

        return (
          <Card
            key={booking.id}
            onClick={() => navigate(`/booking-result/${booking.id}`)}
            className="group cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-md flex flex-col h-full justify-between"
          >
            {/* 📸 KHU VỰC ẢNH XE (Đặt phía trên, cố định chiều cao) */}
            <div className="relative h-40 w-full shrink-0 overflow-hidden bg-muted/20 border-b border-border/40">
              <img
                src={booking.vehicleImage || imageMock}
                alt={booking.vehicleName || "Vehicle"}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
              />
              {/* Badge Tên Xe lơ lửng góc trái ảnh */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                <Bike className="size-3 text-amber-400" />
                {booking.vehicleName || "Vehicle"}
              </div>
            </div>

            {/* 📝 KHU VỰC THÔNG TIN (Gọn gàng bên dưới) */}
            <div className="flex flex-1 flex-col justify-between p-3.5">
              {/* Vùng 1: ID & Badge Trạng thái */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/80 px-1.5 py-0.5 rounded">
                  #{booking.id.slice(-8)}
                </span>
                <Badge
                  className={`flex h-5 items-center gap-0.5 rounded-full border px-2 text-[10px] font-medium shadow-none ${status.className}`}
                >
                  <StatusIcon className="size-3 stroke-[2.5]" />
                  {status.label}
                </Badge>
              </div>

              {/* Vùng 2: Thời gian thuê (Thu gọn cỡ chữ thành text-[11px] để không bị vỡ dòng) */}
              <div className="my-3 space-y-0.5 text-[11px] font-medium text-foreground/80 bg-muted/30 rounded-lg p-2 border border-border/20">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarDays className="size-3 text-primary/70" />
                  <span>Rental Period:</span>
                </div>
                <div className="pl-4.5 font-semibold text-foreground/90 tracking-tight">
                  {formatDateTime(booking.startTime)} &rarr;{" "}
                  {formatDateTime(booking.endTime)}
                </div>
              </div>

              {/* Vùng 3: Tổng tiền & Nút bấm */}
              <div className="flex items-center justify-between pt-2 border-t border-dashed border-border/60 mt-auto">
                <div>
                  <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider block">
                    Total Price
                  </span>
                  <p className="text-sm font-bold text-primary tracking-tight">
                    {booking.totalPrice?.toLocaleString("vi-VN")}
                    <span className="text-[11px] font-semibold ml-0.5">đ</span>
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full gap-0.5 text-[11px] font-medium h-7 px-2 text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-all"
                >
                  Details
                  <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
