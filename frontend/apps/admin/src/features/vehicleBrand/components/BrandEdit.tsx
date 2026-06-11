import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import EntityFormDialog from "@/components/common/EntityFormDialog";

import { Input } from "@repo/ui/components/ui/input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";

import { toast } from "@repo/ui/components/ui/sonner";

import { useUpdateVehicleBrand } from "@/features/vehicleBrand/mutationVehicleBrand";

import type { VehicleBrand } from "@repo/types";

import { vehicleBrandSchema, type VehicleBrandFormData } from "@repo/schemas";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: VehicleBrand | null;
};

export default function BrandEdit({ open, onOpenChange, brand }: Props) {
  const { mutateAsync, isPending } = useUpdateVehicleBrand();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleBrandFormData>({
    resolver: zodResolver(vehicleBrandSchema),
  });

  useEffect(() => {
    if (!brand) return;

    reset({
      name: brand.name,
      country: brand.country,
    });
  }, [brand, reset]);

  const onSubmit = async (values: VehicleBrandFormData) => {
    if (!brand) return;

    try {
      await mutateAsync({
        id: brand.id,
        data: values,
      });

      toast.success("Cập nhật hãng xe thành công");

      onOpenChange(false);
    } catch {
      toast.error("Cập nhật hãng xe thất bại");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Chỉnh sửa hãng xe"
      description="Cập nhật thông tin hãng xe"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Lưu thay đổi"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Tên hãng xe</FieldLabel>

          <Input {...register("name")} />

          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Quốc gia</FieldLabel>

          <Input {...register("country")} />

          {errors.country && <FieldError>{errors.country.message}</FieldError>}
        </Field>
      </FieldGroup>
    </EntityFormDialog>
  );
}
