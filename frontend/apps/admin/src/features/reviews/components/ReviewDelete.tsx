import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
import { useDeleteReview } from "@/features/reviews/mutations";
import { toast } from "@repo/ui/components/ui/sonner";
import type { Review } from "@repo/types";

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
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Review"
      description={`Are you sure you want to delete the review of user #${review?.user_id.substring(0, 6)}? This action cannot be undone.`}
      onConfirm={handleDelete}
      loading={isPending}
      confirmText="Delete"
      cancelText="Cancel"
    />
  );
}
