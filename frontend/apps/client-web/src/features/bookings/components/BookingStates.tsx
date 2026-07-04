import { Bike, ClipboardX } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

// 1. Skeleton nhấp nháy mô phỏng lại hình dáng 3 Card đặt xe
export function BookingSkeleton() {
  return (
    <div className="space-y-4 w-full animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row h-auto sm:h-44 border rounded-2xl bg-card overflow-hidden"
        >
          <div className="h-40 sm:h-full sm:w-[200px] bg-muted" />
          <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 w-1/2">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
              <div className="h-7 bg-muted rounded-full w-24" />
            </div>
            <div className="flex justify-between items-end pt-2 border-t border-dashed">
              <div className="space-y-1 w-1/4">
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-5 bg-muted rounded w-full" />
              </div>
              <div className="h-8 bg-muted rounded-full w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 2. Trạng thái rỗng có chiều sâu, kèm nút kêu gọi hành động (CTA)
export function BookingEmptyState({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed rounded-2xl bg-muted/20">
      <div className="p-4 bg-background border rounded-full text-muted-foreground/60 mb-4 shadow-sm animate-bounce [animation-duration:3s]">
        <ClipboardX className="size-8 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        No bookings found
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
        You haven't booked any motorcycles yet. Start exploring our premium
        fleet and find your perfect ride!
      </p>
      <Button
        onClick={onExplore}
        className="rounded-full shadow-md gap-2 active:scale-95 transition-transform"
      >
        <Bike className="size-4" />
        Explore Motorcycles
      </Button>
    </div>
  );
}
