import { Bike, ClipboardX } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

// 1. Skeleton nhấp nháy mô phỏng lại hình dáng cấu trúc GRID CARD mới
export function BookingSkeleton() {
  return (
    // 🌟 SỬA: Đồng bộ dạng lưới giống hệt component danh sách thực tế
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full animate-pulse max-w-7xl mx-auto p-1">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex flex-col border rounded-xl bg-card overflow-hidden h-[310px] justify-between"
        >
          {/* Vùng Ảnh phía trên */}
          <div className="h-40 w-full bg-muted" />

          {/* Vùng Thông tin phía dưới */}
          <div className="flex-1 p-3.5 flex flex-col justify-between">
            {/* Top: ID & Badge */}
            <div className="flex justify-between items-center">
              <div className="h-4 bg-muted rounded w-16" />
              <div className="h-5 bg-muted rounded-full w-20" />
            </div>

            {/* Middle: Box thời gian thuê giả lập */}
            <div className="my-3 p-2 bg-muted/20 border border-border/10 rounded-lg space-y-2">
              <div className="h-3 bg-muted rounded w-24" />
              <div className="h-3.5 bg-muted rounded w-4/5" />
            </div>

            {/* Bottom: Tổng tiền & Nút bấm */}
            <div className="flex justify-between items-center pt-2 border-t border-dashed border-border/60">
              <div className="space-y-1 w-1/3">
                <div className="h-2.5 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-full" />
              </div>
              <div className="h-7 bg-muted rounded-full w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 2. Trạng thái rỗng cao cấp (Giữ nguyên logic gốc, tối ưu khoảng cách căn chỉnh)
export function BookingEmptyState({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed rounded-xl bg-muted/20 max-w-xl mx-auto my-8">
      <div className="p-4 bg-background border rounded-full text-muted-foreground/60 mb-4 shadow-sm animate-bounce [animation-duration:3s]">
        <ClipboardX className="size-8 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground">
        No bookings found
      </h3>
      <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-5 leading-relaxed">
        You haven't booked any motorcycles yet. Start exploring our premium
        fleet and find your perfect ride!
      </p>
      <Button
        onClick={onExplore}
        size="sm"
        className="rounded-full shadow-md gap-2 active:scale-95 transition-transform text-xs font-semibold px-5 h-9"
      >
        <Bike className="size-4" />
        Explore Motorcycles
      </Button>
    </div>
  );
}
