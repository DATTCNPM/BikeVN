import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
import { useDeleteUser } from "@/features/users/mutations";
import { toast } from "@repo/ui/components/ui/sonner";
import type { User } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export default function UserDelete({ open, onOpenChange, user }: Props) {
  const { mutateAsync, isPending } = useDeleteUser();

  const handleDelete = async () => {
    if (!user) return;
    try {
      await mutateAsync(user.id);
      toast.success("Xóa người dùng thành công");
      onOpenChange(false);
    } catch {
      toast.error("Xóa người dùng thất bại");
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Xóa người dùng"
      description={`Bạn có chắc chắn muốn xóa người dùng ${user?.name} không? Hành động này không thể hoàn tác.`}
      onConfirm={handleDelete}
      loading={isPending}
      confirmText="Xóa"
      cancelText="Hủy"
    />
  );
}
