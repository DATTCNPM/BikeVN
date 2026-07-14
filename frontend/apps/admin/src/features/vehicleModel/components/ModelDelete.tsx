import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

import { toast } from "@repo/ui/components/ui/sonner";

import type { VehicleModel } from "@repo/types";

import { useDeleteVehicleModel } from "@/features/vehicleModel/hooks/mutationVehicleModel";

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
    <UniversalDialog
      type="confirm"
      variant="destructive"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Vehicle Model"
      description={`Are you sure you want to delete model ${model?.name}?`}
      onSubmit={handleDelete}
      loading={isPending}
      submitLabel="Delete"
    />
  );
}
