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
      toast.success("Xóa đánh giá thành công");
      onOpenChange(false);
    } catch {
      toast.error("Xóa đánh giá thất bại");
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Xóa đánh giá"
      description={`Bạn có chắc chắn muốn xóa đánh giá của user #${review?.user_id.substring(0, 6)} không? Hành động này không thể hoàn tác.`}
      onConfirm={handleDelete}
      loading={isPending}
      confirmText="Xóa"
      cancelText="Hủy"
    />
  );
}
