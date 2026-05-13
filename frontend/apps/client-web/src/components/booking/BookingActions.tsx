// components/booking/BookingActions.tsx

import { Button } from "@/components/ui/button";
import { ArrowRight, Bike, ClipboardList } from "lucide-react";

export default function BookingActions() {
  return (
    <aside className="h-fit rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wider text-primary">
        Actions
      </p>

      <h2 className="mt-2 text-2xl font-bold">Tiếp theo</h2>

      <div className="mt-6 flex flex-col gap-4">
        <Button size="lg" className="h-12 rounded-2xl">
          <ClipboardList className="mr-2 size-5" />
          My Booking
        </Button>

        <Button size="lg" variant="secondary" className="h-12 rounded-2xl">
          <Bike className="mr-2 size-5" />
          Continue Browsing
        </Button>

        <Button size="lg" variant="outline" className="h-12 rounded-2xl">
          Contact Support
          <ArrowRight className="ml-2 size-5" />
        </Button>
      </div>

      <div className="mt-8 rounded-2xl bg-primary/10 p-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Thông tin booking đã được gửi đến email của bạn. Vui lòng kiểm tra
          email để theo dõi cập nhật mới nhất.
        </p>
      </div>
    </aside>
  );
}
