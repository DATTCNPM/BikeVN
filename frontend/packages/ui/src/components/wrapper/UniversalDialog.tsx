// components/common/UniversalDialog.tsx
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@repo/ui/components/ui/dialog";
import { Separator } from "@repo/ui/components/ui/separator";

type UniversalDialogProps = {
  type?: "form" | "confirm";
  variant?: "default" | "destructive";
  trigger: React.ReactNode;
  title: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
  error?: string | null;
  onSubmit: (e?: React.FormEvent) => Promise<void> | void;
  children?: React.ReactNode;
  submitLabel?: string;
};

export default function UniversalDialog({
  type = "form",
  variant = "default",
  trigger,
  title,
  description,
  open,
  onOpenChange,
  loading = false,
  error = null,
  onSubmit,
  children,
  submitLabel,
}: UniversalDialogProps) {
  const handleAction = (e: React.FormEvent) => {
  e.preventDefault();
  if (loading) return;
  onSubmit(e); 
};

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[520px] p-0 rounded-2xl overflow-hidden border border-border/80 shadow-xl bg-background">
        {type === "form" ? (
          <form
            onSubmit={handleAction}
            className="flex flex-col h-full relative"
          >
            <DialogContentBody />
          </form>
        ) : (
          <div className="flex flex-col h-full">
            <DialogContentBody />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  function DialogContentBody() {
    return (
      <>
        {/* Header biệt lập */}
        <DialogHeader className="p-6 bg-muted/10 pb-4">
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            {type === "confirm" && variant === "destructive" && (
              <AlertCircle className="size-5 text-destructive shrink-0" />
            )}
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {type === "form" && <Separator className="bg-border/60" />}

        {/* Khu vực Form Content xử lý Custom Loading chuyên dụng */}
        {type === "form" && children && (
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto global-scrollbar relative min-h-[150px]">
            {/* ✨ HIỆU ỨNG CUSTOM FORM LOADING OVERLAY CAO CẤP */}
            {loading && (
              <div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200">
                {/* Vòng đập theo nhịp (Pulse Animation) sang trọng */}
                <div className="relative flex h-10 w-10 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/20 opacity-75"></span>
                  <div className="relative rounded-full h-8 w-8 bg-primary/10 flex items-center justify-center border border-primary/30">
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase animate-pulse">
                  Processing data...
                </p>
              </div>
            )}

            {/* Dưới lớp loading, bọc field để mờ đi khi đang xử lý */}
            <div
              className={`space-y-4 transition-all duration-300 ${loading ? "opacity-40 pointer-events-none select-none blur-[0.5px]" : ""}`}
            >
              {children}
            </div>
          </div>
        )}

        {/* Thông báo lỗi dạng Banner */}
        {error && (
          <div className="mx-6 mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive text-xs font-medium">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Footer chứa nút thao tác */}
        <DialogFooter className="p-8 bg-muted/20 border-t border-border/40 gap-4 sm:gap-0 flex-row justify-end items-center">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              className="h-11 rounded-xl font-medium text-muted-foreground hover:bg-muted"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type={type === "form" ? "submit" : "button"}
            variant={variant}
            disabled={loading}
            onClick={type === "confirm" ? handleAction : undefined}
            className="h-11 rounded-xl font-semibold min-w-[100px]"
          >
            {/* Nếu là confirm thì hiện Loader nhỏ trên nút, nếu là form thì chữ giữ nguyên vì đã có loading bọc ở trên thân form */}
            {loading && type === "confirm" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              submitLabel || (type === "form" ? "Save Changes" : "Confirm")
            )}
          </Button>
        </DialogFooter>
      </>
    );
  }
}
