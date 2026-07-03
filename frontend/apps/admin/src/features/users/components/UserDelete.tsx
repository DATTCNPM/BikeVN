import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";
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
      toast.success("User deleted successfully");
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <UniversalDialog
      type="confirm"
      variant="destructive"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Delete User"
      description={`Are you sure you want to delete the user "${user?.name}"? This action cannot be undone.`}
      onSubmit={handleDelete}
      loading={isPending}
      submitLabel="Delete"
    />
  );
}
