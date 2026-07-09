import { CalendarDays, MapPin, Banknote } from "lucide-react";
import { Card } from "@repo/ui/components/ui/card";
import type { Vehicle, Booking, Branch } from "@repo/types";
import { filterImagePrimary, formatDateTime } from "@repo/utils";
import imageMock from "@/assets/images/motorbike1.png";

type Props = {
  booking: Booking | null | undefined;
  vehicle: Vehicle | null | undefined;
  pickupBranch?: Branch;
  returnBranch?: Branch;
};

export default function BookingVehicleCard({
  booking,
  vehicle,
  pickupBranch,
  returnBranch,
}: Props) {
  return (
    <Card className="overflow-hidden rounded-[2rem] border-border bg-card shadow-sm">
      <div className="grid lg:grid-cols-[280px_1fr]">
        {/* Ảnh xe */}
        <div className="relative h-48 lg:h-full w-full bg-muted">
          <img
            src={filterImagePrimary(vehicle?.images || []) || imageMock}
            alt={vehicle?.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Cụm thông tin tích hợp gọn gàng */}
        <div className="p-6 flex flex-col justify-between space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-dashed border-border pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Vehicle Rental
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight">
                {vehicle?.name || "N/A"}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono bg-muted px-2.5 py-1 rounded-md border text-muted-foreground block">
                #{booking?.id?.slice(-8).toUpperCase() || "N/A"}
              </span>
            </div>
          </div>

          {/* Grid thông tin 3 cột cực kỳ gọn */}
          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            {/* Lịch trình */}
            <div className="flex gap-2.5">
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary h-fit">
                <CalendarDays className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground">Schedule</p>
                <p className="font-semibold">
                  {formatDateTime(booking?.startTime || "")}
                </p>
                <p className="font-semibold text-amber-600">
                  {formatDateTime(booking?.endTime || "")}
                </p>
              </div>
            </div>

            {/* Trạm giao nhận */}
            <div className="flex gap-2.5">
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary h-fit">
                <MapPin className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground">Branches</p>
                <p className="font-semibold text-foreground">
                  Pick: {pickupBranch?.name || "N/A"}
                </p>
                <p className="font-semibold text-muted-foreground">
                  Return: {returnBranch?.name || "N/A"}
                </p>
              </div>
            </div>

            {/* Chi phí & Trạng thái đơn */}
            <div className="flex gap-2.5 sm:border-l sm:pl-4 border-dashed border-border">
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary h-fit">
                <Banknote className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground">
                  Billing Summary
                </p>
                <p className="font-black text-sm text-primary">
                  {booking?.totalPrice
                    ? `${booking.totalPrice.toLocaleString("vi-VN")}đ`
                    : "N/A"}
                </p>
                <p className="text-[11px] text-muted-foreground italic">
                  Created:{" "}
                  {formatDateTime(booking?.createdAt || "").split(" ")[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
