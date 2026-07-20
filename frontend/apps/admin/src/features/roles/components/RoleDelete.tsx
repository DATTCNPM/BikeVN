import { toast } from "@repo/ui/components/ui/sonner";

import { useDeleteRole } from "../hooks/mutationsRole";

import type { RoleType } from "@repo/schemas";
import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleType | null;
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
    <UniversalDialog
      type="confirm"
      variant="destructive"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Role"
      description={`Are you sure you want to delete the role "${role?.name}"? This action cannot be undone.`}
      onSubmit={handleDelete}
      loading={isPending}
      submitLabel="Delete"
    />
  );
}
