import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { ClipboardList } from "lucide-react";
import { toast } from "@repo/ui/components/ui/sonner";

export const IdCell = ({
  id,
  prefix = "",
}: {
  id: string;
  prefix?: string;
}) => {
  // Lấy 6 ký tự viết hoa cho giống mã định danh chuyên nghiệp (ví dụ: #A1B2C3)
  const shortId = id.substring(0, 6).toUpperCase();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(id);
    // Nếu dự án có sonner hoặc toast: toast.success("Đã sao chép ID đầy đủ")
    toast.success("Has been copied to clipboard with ID: " + id);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="group flex cursor-pointer items-center gap-1 font-mono text-xs select-all active:scale-95 transition-transform"
            onClick={handleCopy}
          >
            <span className="text-muted-foreground">{prefix}</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 hover:text-primary decoration-zinc-400">
              {shortId}
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-muted-foreground">
              <ClipboardList className="size-3" />
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="font-mono text-xs max-w-xs break-all bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
        >
          <p className="font-sans text-[11px] text-muted-foreground mb-1">
            Click to copy full ID:
          </p>
          {id}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
