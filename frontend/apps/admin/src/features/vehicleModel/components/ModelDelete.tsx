import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";

import { toast } from "@repo/ui/components/ui/sonner";

import type { VehicleModel } from "@repo/types";

import { useDeleteVehicleModel } from "@/features/vehicleModel/mutationVehicleModel";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: VehicleModel | null;
};

export default function ModelDelete({ open, onOpenChange, model }: Props) {
  const { mutateAsync, isPending } = useDeleteVehicleModel();

  const handleDelete = async () => {
    if (!model) return;

    try {
      await mutateAsync(model.id);

      toast.success("Delete vehicle model successfully");

      onOpenChange(false);
    } catch {
      toast.error("Failed to delete vehicle model");
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Vehicle Model"
      description={`Are you sure you want to delete model ${model?.name}?`}
      onConfirm={handleDelete}
      loading={isPending}
      confirmText="Delete"
      cancelText="Cancel"
    />
  );
}
