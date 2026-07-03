import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";
import { toast } from "@repo/ui/components/ui/sonner";

import { useDeleteVehicle } from "@/features/vehicles/mutations";

import type { Vehicle } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
};

export default function VehicleDelete({ open, onOpenChange, vehicle }: Props) {
  const { mutateAsync, isPending } = useDeleteVehicle();

  const handleDelete = async () => {
    if (!vehicle) return;

    try {
      await mutateAsync(vehicle.id);

      toast.success("Delete vehicle successfully");

      onOpenChange(false);
    } catch {
      toast.error("Failed to delete vehicle");
    }
  };

  return (
    <UniversalDialog
      type="confirm"
      variant="destructive"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Vehicle"
      description={`Are you sure you want to delete the vehicle ${vehicle?.name}?`}
      onSubmit={handleDelete}
      loading={isPending}
      submitLabel="Delete"
    />
  );
}
