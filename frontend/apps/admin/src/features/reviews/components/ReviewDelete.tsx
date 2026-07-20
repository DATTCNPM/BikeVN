import { useDeleteReview } from "../hooks/mutations";

import { toast } from "@repo/ui/components/ui/sonner";

import type { Review } from "@repo/schemas";
import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
};

export default function ReviewDelete({ open, onOpenChange, review }: Props) {
  const { mutateAsync, isPending } = useDeleteReview();

  const handleDelete = async () => {
    if (!review) return;

    try {
      await mutateAsync(review.id);

      toast.success("Delete review successfully");

      onOpenChange(false);
    } catch {
      toast.error("Failed to delete review");
    }
  };

  return (
    <UniversalDialog
      type="confirm"
      variant="destructive"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Review"
      description={`Are you sure you want to delete the review of user #${review?.userId.slice(0, 6)}? This action cannot be undone.`}
      onSubmit={handleDelete}
      loading={isPending}
      submitLabel="Delete"
    />
  );
}
