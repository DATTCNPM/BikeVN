import { toast } from "@repo/ui/components/ui/sonner";

import { useDeleteVehicleImage } from "@/features/vehicleImages/mutationVehicleImage";

import type { VehicleImage } from "@repo/types";
import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

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

      toast.success("Delete image successfully");

      onOpenChange(false);
    } catch {
      toast.error("Failed to delete image");
    }
  };

  return (
    <UniversalDialog
      type="confirm"
      variant="destructive"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Vehicle Image"
      description="Are you sure you want to delete this image?"
      onSubmit={handleDelete}
      loading={isPending}
      submitLabel="Delete"
    />
  );
}
