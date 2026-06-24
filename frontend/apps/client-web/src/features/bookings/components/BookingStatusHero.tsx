// components/booking/BookingStatusHero.tsx
import { CheckCircle2, Clock3, CircleX, Ban } from "lucide-react";
import type { Booking } from "@repo/types";

type Props = {
  status: Booking["status"] | null;
};

type StatusConfigItem = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  titleClass: string;
};

const STATUS_CONFIG: Record<Booking["status"], StatusConfigItem> = {
  pending: {
    title: "Booking Successful",
    description: "Your booking is pending confirmation from the store.",
    icon: Clock3,
    iconClass: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
    titleClass: "text-yellow-500",
  },
  approved: {
    title: "Booking Approved",
    description:
      "Your booking has been approved and the bike is ready for pickup.",
    icon: CheckCircle2,
    iconClass: "bg-green-500/15 text-green-500 border-green-500/20",
    titleClass: "text-green-500",
  },
  completed: {
    title: "Trip Completed",
    description: "Thank you for using our service.",
    icon: CheckCircle2,
    iconClass: "bg-primary/15 text-primary border-primary/20",
    titleClass: "text-primary",
  },
  rejected: {
    title: "Booking Rejected",
    description: "Please try again with a different time.",
    icon: CircleX,
    iconClass: "bg-red-500/15 text-red-500 border-red-500/20",
    titleClass: "text-red-500",
  },
  cancelled: {
    title: "Booking Cancelled",
    description: "Your booking is no longer valid.",
    icon: Ban,
    iconClass: "bg-muted text-muted-foreground border-border",
    titleClass: "text-muted-foreground",
  },
};

export default function BookingStatusHero({ status }: Props) {
  const activeStatus = status || "pending";
  const config = STATUS_CONFIG[activeStatus] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-sm">
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col items-center text-center space-y-4">
        <div className="flex items-center gap-4">
          <div
            className={`flex size-24 items-center justify-center rounded-full border ${config.iconClass}`}
          >
            <Icon className="size-12" />
          </div>
          <h1
            className={`text-4xl font-black tracking-tight ${config.titleClass}`}
          >
            {config.title}
          </h1>
        </div>
        <p className="max-w-2xl text-muted-foreground">{config.description}</p>
      </div>
    </section>
  );
}
