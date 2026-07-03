import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";
import { useDeleteEmployee } from "@/features/employees/mutationEmployee";
import { toast } from "@repo/ui/components/ui/sonner";
import type { User } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export default function EmployeeDelete({ open, onOpenChange, user }: Props) {
  const { mutateAsync, isPending } = useDeleteEmployee();

  const handleDelete = async () => {
    if (!user) return;
    try {
      await mutateAsync(user.id);
      toast.success("Delete employee successfully");
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  return (
    <UniversalDialog
      variant="destructive"
      trigger={null}
      type="confirm"
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Employee"
      description={`Are you sure you want to delete employee ${user?.name}? This action cannot be undone.`}
      onSubmit={handleDelete}
      loading={isPending}
      submitLabel="Delete"
    />
  );
}
