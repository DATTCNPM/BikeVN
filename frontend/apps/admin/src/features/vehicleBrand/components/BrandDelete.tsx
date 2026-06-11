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

      toast.success("Xóa hãng xe thành công");

      onOpenChange(false);
    } catch {
      toast.error("Xóa hãng xe thất bại");
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Xóa hãng xe"
      description={`Bạn có chắc muốn xóa ${brand?.name}?`}
      onConfirm={handleDelete}
      loading={isPending}
      confirmText="Xóa"
    />
  );
}
