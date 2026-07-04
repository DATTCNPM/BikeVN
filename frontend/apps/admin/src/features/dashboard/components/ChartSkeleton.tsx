import { Inbox } from "lucide-react";

// 1. Hiệu ứng loading nhấp nháy giả lập Biểu đồ
export function ChartSkeleton() {
  return (
    <div className="w-full h-[350px] bg-card rounded-xl border p-6 flex flex-col justify-between animate-pulse">
      <div className="space-y-2">
        <div className="h-5 w-1/4 bg-muted rounded" />
        <div className="h-4 w-1/3 bg-muted/60 rounded" />
      </div>
      <div className="flex items-end gap-4 h-[200px] pt-4">
        <div className="h-[40%] w-full bg-muted rounded-t animate-pulse delay-75" />
        <div className="h-[75%] w-full bg-muted rounded-t animate-pulse delay-150" />
        <div className="h-[50%] w-full bg-muted rounded-t animate-pulse delay-300" />
        <div className="h-[90%] w-full bg-muted rounded-t animate-pulse delay-200" />
      </div>
    </div>
  );
}

// 2. Trạng thái trống (Empty State) tinh tế khi không có dữ liệu
export function ChartEmptyState({ title }: { title: string }) {
  return (
    <div className="w-full h-[350px] bg-card rounded-xl border p-6 flex flex-col items-center justify-center text-center">
      <div className="p-4 bg-muted/50 rounded-full text-muted-foreground/70 mb-4 animate-bounce [animation-duration:3s]">
        <Inbox className="size-8 stroke-[1.5]" />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mt-1">
        No data available for this period. Check back later or try adjusting
        your filters.
      </p>
    </div>
  );
}
