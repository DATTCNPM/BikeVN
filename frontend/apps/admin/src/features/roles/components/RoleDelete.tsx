import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";

import { toast } from "@repo/ui/components/ui/sonner";

import { useDeleteRole } from "../mutationsRole";

import type { Role } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
};

export default function RoleDelete({ open, onOpenChange, role }: Props) {
  const { mutateAsync, isPending } = useDeleteRole();

  const handleDelete = async () => {
    if (!role) return;

    try {
      await mutateAsync(role.id || "");

      toast.success("Xóa vai trò thành công");

      onOpenChange(false);
    } catch {
      toast.error("Xóa vai trò thất bại");
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Xóa vai trò"
      description={`Bạn có chắc chắn muốn xóa vai trò "${role?.name}" không? Hành động này không thể hoàn tác.`}
      onConfirm={handleDelete}
      loading={isPending}
      confirmText="Xóa"
      cancelText="Hủy"
    />
  );
}
