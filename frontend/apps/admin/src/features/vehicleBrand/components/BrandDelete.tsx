import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";

import { toast } from "@repo/ui/components/ui/sonner";

import { useDeleteVehicleBrand } from "@/features/vehicleBrand/mutationVehicleBrand";

import type { VehicleBrand } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: VehicleBrand | null;
};

export default function BrandDelete({ open, onOpenChange, brand }: Props) {
  const { mutateAsync, isPending } = useDeleteVehicleBrand();

  const handleDelete = async () => {
    if (!brand) return;

    try {
      await mutateAsync(brand.id);

      toast.success("Delete vehicle brand successfully");

      onOpenChange(false);
    } catch {
      toast.error("Failed to delete vehicle brand");
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Vehicle Brand"
      description={`Are you sure you want to delete ${brand?.name}?`}
      onConfirm={handleDelete}
      loading={isPending}
      confirmText="Delete"
      cancelText="Cancel"
    />
  );
}
