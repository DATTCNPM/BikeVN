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

      toast.success("Role deleted successfully");

      onOpenChange(false);
    } catch {
      toast.error("Failed to delete role");
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Role"
      description={`Are you sure you want to delete the role "${role?.name}"? This action cannot be undone.`}
      onConfirm={handleDelete}
      loading={isPending}
      confirmText="Delete"
      cancelText="Cancel"
    />
  );
}
