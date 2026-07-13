// components/booking/BookingStatusHero.tsx
import {
  CheckCircle2,
  Clock3,
  CircleX,
  Ban,
  CalendarCheck,
} from "lucide-react";
import type { Booking } from "@repo/types";

type Props = {
  status: Booking["status"] | null | undefined;
};

type StatusConfigItem = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  titleClass: string;
  glowClass: string; // Thêm màu nền mờ phía sau cho đồng bộ
};

const STATUS_CONFIG: Record<Booking["status"], StatusConfigItem> = {
  pending: {
    title: "Booking Pending",
    description: "Your booking is pending confirmation from the store.",
    icon: Clock3,
    // 🟡 Màu vàng/hổ phách: Thể hiện trạng thái đang chờ xử lý
    iconClass:
      "bg-amber-500/15 text-amber-600 border-amber-500/20 dark:text-amber-400",
    titleClass: "text-amber-600 dark:text-amber-400",
    glowClass: "bg-amber-500/10",
  },
  approved: {
    title: "Booking Approved",
    description:
      "Your booking has been approved and the bike is ready for pickup.",
    icon: CalendarCheck, // Đổi sang icon lịch hẹn cho đúng nghĩa chuẩn bị đi
    // 🔵 Màu xanh dương: Thể hiện sự tin cậy, lịch trình đã lên lịch sẵn sàng
    iconClass:
      "bg-blue-500/15 text-blue-600 border-blue-500/20 dark:text-blue-400",
    titleClass: "text-blue-600 dark:text-blue-400",
    glowClass: "bg-blue-500/10",
  },
  completed: {
    title: "Trip Completed",
    description: "Thank you for using our service.",
    icon: CheckCircle2,
    // 🟢 Màu xanh lá: Thể hiện giao dịch kết thúc an toàn, thành công, trọn vẹn
    iconClass:
      "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    titleClass: "text-emerald-600 dark:text-emerald-400",
    glowClass: "bg-emerald-500/10",
  },
  rejected: {
    title: "Booking Rejected",
    description: "Please try again with a different time.",
    icon: CircleX,
    // 🔴 Màu đỏ: Cảnh báo đơn hàng bị hệ thống từ chối (lỗi/hết xe)
    iconClass:
      "bg-rose-500/15 text-rose-600 border-rose-500/20 dark:text-rose-400",
    titleClass: "text-rose-600 dark:text-rose-400",
    glowClass: "bg-rose-500/10",
  },
  cancelled: {
    title: "Booking Cancelled",
    description: "Your booking is no longer valid.",
    icon: Ban,
    // ⚫ Màu xám trung tính: Trạng thái đóng băng, do người dùng chủ động hủy
    iconClass: "bg-muted text-muted-foreground border-border",
    titleClass: "text-muted-foreground",
    glowClass: "bg-muted/50",
  },
};

export default function BookingStatusHero({ status }: Props) {
  const currentStatus = status || "pending";
  const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-sm transition-all duration-300">
      {/* 🌟 Glow effect phía sau đổi màu động theo từng trạng thái */}
      <div
        className={`absolute right-0 top-0 h-56 w-56 rounded-full blur-3xl pointer-events-none transition-colors duration-300 ${config.glowClass}`}
      />

      <div className="relative flex flex-col items-center text-center space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div
            className={`flex size-20 items-center justify-center rounded-full border transition-all duration-300 ${config.iconClass}`}
          >
            <Icon className="size-10 stroke-[2.5]" />
          </div>
          <h1
            className={`text-3xl sm:text-4xl font-black tracking-tight transition-colors duration-300 ${config.titleClass}`}
          >
            {config.title}
          </h1>
        </div>
        <p className="max-w-2xl text-sm sm:text-base text-muted-foreground">
          {config.description}
        </p>
      </div>
    </section>
  );
}
