import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
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

// 🌟 ĐỊNH NGHĨA KIỂU DỮ LIỆU TYPE-SAFE CHO CONFIG STATUS (THAY ANY)
type StatusSetting = {
  label: string;
  className: string;
  icon: React.ComponentType<{ className?: string }>;
};

const statusConfig: Record<Booking["status"], StatusSetting> = {
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
  createdAt: string; // Sử dụng để sort dữ liệu
};

// Định nghĩa các loại Tab lọc
type FilterTab = "all" | "active" | "completed" | "cancelled";

export default function MyBookingPage() {
  const navigate = useNavigate();
  const { data: user } = useProfile();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookingsByUser(
    user?.id || "",
  );

  // 🌟 STATE QUẢN LÝ TAB BỘ LỌC HIỆN TẠI
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // 🌟 XỬ LÝ LỌC VÀ SẮP XẾP DỮ LIỆU ĐỘNG (DÙNG USEMEMO ĐỂ TỐI ƯU HIỆU NĂNG)
  const processedBookings = useMemo(() => {
    const typedBookings = bookings as BookingWithVehicle[];

    // Bước 1: Sắp xếp đơn đặt xe mới nhất lên đầu (createdAt giảm dần)
    const sorted = [...typedBookings].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Bước 2: Tiến hành lọc theo Tab đang chọn
    switch (activeTab) {
      case "active":
        return sorted.filter(
          (b) => b.status === "pending" || b.status === "approved",
        );
      case "completed":
        return sorted.filter((b) => b.status === "completed");
      case "cancelled":
        return sorted.filter(
          (b) => b.status === "cancelled" || b.status === "rejected",
        );
      default:
        return sorted;
    }
  }, [bookings, activeTab]);

  if (bookingsLoading) return <BookingSkeleton />;
  if (bookings.length === 0) {
    return <BookingEmptyState onExplore={() => navigate("/home")} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-1 space-y-6">
      {/* 🌟 THANH TABS LỌC UI (Giao diện Bo góc hiện đại, Responsive mượt mà) */}
      <div className="flex border-b border-border/60 overflow-x-auto no-scrollbar gap-1 text-sm font-medium">
        {(
          [
            { id: "all", label: "All Bookings" },
            { id: "active", label: "Active" },
            { id: "completed", label: "Completed" },
            { id: "cancelled", label: "Cancelled / Rejected" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-4 py-2.5 border-b-2 transition-all duration-200 ${
              activeTab === tab.id
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🌟 HIỂN THỊ TRẠNG THÁI TRỐNG RIÊNG CHO TỪNG TAB */}
      {processedBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            No bookings found in this section.
          </p>
        </div>
      ) : (
        /* 🌟 GRID Ô CỜ HIỂN THỊ DANH SÁCH THẺ */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 select-none w-full">
          {processedBookings.map((booking) => {
            const status = statusConfig[booking.status] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <Card
                key={booking.id}
                onClick={() => navigate(`/booking-result/${booking.id}`)}
                className="group cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-md flex flex-col h-full justify-between"
              >
                {/* 📸 KHU VỰC ẢNH XE */}
                <div className="relative h-40 w-full shrink-0 overflow-hidden bg-muted/20 border-b border-border/40">
                  <img
                    src={booking.vehicleImage || imageMock}
                    alt={booking.vehicleName || "Vehicle"}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                  />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    <Bike className="size-3 text-amber-400" />
                    {booking.vehicleName || "Vehicle"}
                  </div>
                </div>

                {/* 📝 KHU VỰC THÔNG TIN */}
                <div className="flex flex-1 flex-col justify-between p-3.5">
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

                  {/* Thời gian thuê */}
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

                  {/* Tổng tiền & Nút bấm */}
                  <div className="flex items-center justify-between pt-2 border-t border-dashed border-border/60 mt-auto">
                    <div>
                      <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider block">
                        Total Price
                      </span>
                      <p className="text-sm font-bold text-primary tracking-tight">
                        {booking.totalPrice?.toLocaleString("vi-VN")}
                        <span className="text-[11px] font-semibold ml-0.5">
                          đ
                        </span>
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
      )}
    </div>
  );
}
