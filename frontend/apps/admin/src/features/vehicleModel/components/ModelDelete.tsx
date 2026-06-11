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

      toast.success("Xóa model xe thành công");

      onOpenChange(false);
    } catch {
      toast.error("Xóa model xe thất bại");
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Xóa model xe"
      description={`Bạn có chắc muốn xóa model ${model?.name}?`}
      onConfirm={handleDelete}
      loading={isPending}
      confirmText="Xóa"
    />
  );
}
