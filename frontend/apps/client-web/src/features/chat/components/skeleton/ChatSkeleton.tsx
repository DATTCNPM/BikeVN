// @/features/chat/components/ChatSkeleton.tsx
import { Skeleton } from "@repo/ui/components/ui/skeleton";

// Skeleton cho từng item hội thoại ở Sidebar
export function ConversationItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-transparent">
      <Skeleton className="size-10 rounded-full shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-10 rounded" />
        </div>
        <Skeleton className="h-3 w-3/4 rounded" />
      </div>
    </div>
  );
}

// Skeleton cho bong bóng tin nhắn trong Khung chat
export function MessageItemSkeleton({ isRight }: { isRight?: boolean }) {
  return (
    <div
      className={`flex gap-3 max-w-[75%] ${isRight ? "ml-auto flex-row-reverse" : "mr-auto"}`}
    >
      {!isRight && <Skeleton className="size-8 rounded-full shrink-0" />}
      <div className="space-y-1.5">
        {!isRight && <Skeleton className="h-3 w-16 rounded" />}
        <Skeleton
          className={`h-9 w-48 rounded-2xl ${isRight ? "bg-primary/20" : ""}`}
        />
      </div>
    </div>
  );
}
