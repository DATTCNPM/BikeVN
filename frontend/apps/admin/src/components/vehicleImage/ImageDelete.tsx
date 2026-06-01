import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";

import { toast } from "@repo/ui/components/ui/sonner";

import { useDeleteVehicleImage } from "@/features/vehicles/mutationVehicleImage";

import type { VehicleImage } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  vehicleId: string;

  image: VehicleImage | null;
};

export default function VehicleImageDelete({
  open,
  onOpenChange,
  vehicleId,
  image,
}: Props) {
  const { mutateAsync, isPending } = useDeleteVehicleImage();

  const handleDelete = async () => {
    if (!image) return;

    try {
      await mutateAsync({
        vehicleId,
        imageId: image.id,
      });

      toast.success("Xóa ảnh thành công");

      onOpenChange(false);
    } catch {
      toast.error("Xóa ảnh thất bại");
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Xóa ảnh xe"
      description="Bạn có chắc muốn xóa ảnh này không?"
      onConfirm={handleDelete}
      loading={isPending}
      confirmText="Xóa"
    />
  );
}
