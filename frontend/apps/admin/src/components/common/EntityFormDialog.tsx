// components/common/EntityFormDialog.tsx

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@repo/ui/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description?: string;

  children: ReactNode;

  onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void>;

  loading?: boolean;

  submitText?: string;
};

export default function EntityFormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  loading,
  submitText = "Lưu",
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form
          onSubmit={(e) => {
            void onSubmit?.(e);
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>

            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="py-4">{children}</div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}

              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
