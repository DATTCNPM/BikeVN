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

type FormDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
  open: boolean;
  onOpen: (open: boolean) => void;
};

export default function FormDialog({
  trigger,
  title,
  description,
  onSubmit,
  children,
  open,
  onOpen,
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
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
