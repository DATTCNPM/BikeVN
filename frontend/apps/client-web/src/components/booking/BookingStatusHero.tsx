// components/booking/BookingStatusHero.tsx

import { CheckCircle2, Clock3, CircleX, Ban } from "lucide-react";
import type { Booking } from "@/lib/types";
type Props = {
  status: Booking["status"];
};

const statusConfig: Record<Booking["status"], any> = {
  pending: {
    title: "Đặt xe thành công",
    description: "Booking của bạn đang chờ xác nhận từ cửa hàng.",
    icon: Clock3,
    iconClass: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  },

  approved: {
    title: "Booking đã được xác nhận",
    description: "Xe đã sẵn sàng cho chuyến đi của bạn.",
    icon: CheckCircle2,
    iconClass: "bg-green-500/15 text-green-500 border-green-500/20",
  },

  completed: {
    title: "Chuyến đi đã hoàn thành",
    description: "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.",
    icon: CheckCircle2,
    iconClass: "bg-primary/15 text-primary border-primary/20",
  },

  rejected: {
    title: "Booking bị từ chối",
    description: "Vui lòng thử lại với thời gian khác.",
    icon: CircleX,
    iconClass: "bg-red-500/15 text-red-500 border-red-500/20",
  },

  cancelled: {
    title: "Booking đã bị hủy",
    description: "Booking của bạn hiện không còn hiệu lực.",
    icon: Ban,
    iconClass: "bg-muted text-muted-foreground border-border",
  },
};

export default function BookingStatusHero({ status }: Props) {
  const config = statusConfig[status] || statusConfig["pending"];

  const Icon = config.icon;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-sm">
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        <div
          className={`flex size-24 items-center justify-center rounded-full border ${config.iconClass}`}
        >
          <Icon className="size-12" />
        </div>

        <h1 className="mt-6 text-4xl font-black tracking-tight">
          {config.title}
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          {config.description}
        </p>
      </div>
    </section>
  );
}
