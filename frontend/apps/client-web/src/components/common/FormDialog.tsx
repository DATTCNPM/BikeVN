import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

type FormDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
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
        <form onSubmit={onSubmit} className="space-y-4">
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
