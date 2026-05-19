import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
import { useDeleteBranch } from "@/features/branches/mutations";
import { toast } from "@repo/ui/components/ui/sonner";
import type { Branch } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Branch | null;
};

export default function BranchDelete({ open, onOpenChange, branch }: Props) {
  const { mutateAsync, isPending } = useDeleteBranch();

  const handleDelete = async () => {
    if (!branch) return;
    try {
      await mutateAsync(branch.id);
      toast.success("Xóa chi nhánh thành công");
      onOpenChange(false);
    } catch {
      toast.error("Xóa chi nhánh thất bại");
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Xóa chi nhánh"
      description={`Bạn có chắc chắn muốn xóa chi nhánh ${branch?.name} không? Hành động này không thể hoàn tác.`}
      onConfirm={handleDelete}
      loading={isPending}
      confirmText="Xóa"
      cancelText="Hủy"
    />
  );
}
