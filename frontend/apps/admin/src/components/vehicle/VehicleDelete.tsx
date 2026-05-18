import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";

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

      toast.success("Xóa xe thành công");

      onOpenChange(false);
    } catch {
      toast.error("Xóa xe thất bại");
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Xóa xe"
      description={`Bạn có chắc muốn xóa xe ${vehicle?.name}?`}
      onConfirm={handleDelete}
      loading={isPending}
      confirmText="Xóa"
    />
  );
}
