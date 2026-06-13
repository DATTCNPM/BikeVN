import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";

import { toast } from "@repo/ui/components/ui/sonner";

import { useDeletePermission } from "../mutationsPermission";

import type { Permission } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission: Permission | null;
};

export default function PermissionDelete({
  open,
  onOpenChange,
  permission,
}: Props) {
  const { mutateAsync: deletePermission, isPending } = useDeletePermission();
  console.log("Deleting permission:", permission);
  const handleDelete = async () => {
    if (!permission) return;

    try {
      await deletePermission(permission.id || "");

      toast.success("Xóa quyền thành công");

      onOpenChange(false);
    } catch {
      toast.error("Xóa quyền thất bại");
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Xóa quyền"
      description={`Bạn có chắc chắn muốn xóa quyền "${permission?.name}" không? Hành động này không thể hoàn tác.`}
      onConfirm={handleDelete}
      loading={isPending}
      confirmText="Xóa"
      cancelText="Hủy"
    />
  );
}
