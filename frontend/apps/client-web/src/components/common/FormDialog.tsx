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
import { Spinner } from "@repo/ui/components/ui/spinner";

type FormDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  onSubmit: () => void;
  children: React.ReactNode;
  open: boolean;
  onOpen: (open: boolean) => void;
  loading: boolean;
  error: string | null;
};

export default function FormDialog({
  trigger,
  title,
  description,
  onSubmit,
  children,
  open,
  onOpen,
  loading,
  error,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form submitted, calling onSubmit...");
            onSubmit();
          }}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <Separator />

          {children}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
