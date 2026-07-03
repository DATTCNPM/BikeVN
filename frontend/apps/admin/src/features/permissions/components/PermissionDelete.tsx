import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

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

      toast.success("Delete permission successfully");

      onOpenChange(false);
    } catch {
      toast.error("Failed to delete permission");
    }
  };

  return (
    <UniversalDialog
      type="confirm"
      variant="destructive"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Permission"
      description={`Are you sure you want to delete the permission "${permission?.name}"? This action cannot be undone.`}
      onSubmit={handleDelete}
      loading={isPending}
      submitLabel="Delete"
    />
  );
}
