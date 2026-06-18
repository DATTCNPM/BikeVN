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
      toast.success("Branch deleted successfully");
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete branch");
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Branch"
      description={`Are you sure you want to delete the branch ${branch?.name}? This action cannot be undone.`}
      onConfirm={handleDelete}
      loading={isPending}
      confirmText="Delete"
      cancelText="Cancel"
    />
  );
}
