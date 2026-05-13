// components/booking/BookingInfoCard.tsx

import { Card } from "@/components/ui/card";

type Props = {
  booking: any;
};

export default function BookingInfoCard({ booking }: Props) {
  return (
    <Card className="rounded-[2rem] border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Booking Information
          </p>

          <h2 className="mt-2 text-2xl font-bold">Thông tin booking</h2>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <InfoItem label="Booking ID" value={booking.id} />

        <InfoItem label="Status" value={booking.status} />

        <InfoItem label="Created At" value={booking.created_at} />

        <InfoItem
          label="Total Price"
          value={`${booking.total_price.toLocaleString("vi-VN")}đ`}
        />
      </div>
    </Card>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/50 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}
