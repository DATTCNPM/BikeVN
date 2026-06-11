import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import EntityFormDialog from "@/components/common/EntityFormDialog";

import { Input } from "@repo/ui/components/ui/input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

import { toast } from "@repo/ui/components/ui/sonner";

import { useVehicleBrands } from "@repo/hooks";

import { vehicleModelSchema, type VehicleModelFormData } from "@repo/schemas";

import type { VehicleModel } from "@repo/types";

import { useUpdateVehicleModel } from "@/features/vehicleModel/mutationVehicleModel";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: VehicleModel | null;
};

export default function ModelEdit({ open, onOpenChange, model }: Props) {
  const { mutateAsync, isPending } = useUpdateVehicleModel();

  const { data: brands = [] } = useVehicleBrands();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleModelFormData>({
    resolver: zodResolver(vehicleModelSchema),
  });

  useEffect(() => {
    if (!model) return;

    reset({
      name: model.name,
      brandId: model.brandId,
      engineCapacity: model.engineCapacity,
      yearFrom: model.yearFrom,
      yearTo: model.yearTo,
    });
  }, [model, reset]);

  const onSubmit = async (values: VehicleModelFormData) => {
    if (!model) return;

    try {
      await mutateAsync({
        id: model.id,
        data: values,
      });

      toast.success("Cập nhật model xe thành công");

      onOpenChange(false);
    } catch {
      toast.error("Cập nhật model xe thất bại");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Chỉnh sửa model xe"
      description="Cập nhật thông tin model xe"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Lưu thay đổi"
    >
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Tên model xe</FieldLabel>

            <Input {...register("name")} />

            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Hãng xe</FieldLabel>

            <Controller
              control={control}
              name="brandId"
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.brandId && (
              <FieldError>{errors.brandId.message}</FieldError>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Dung tích động cơ</FieldLabel>

            <Input
              type="number"
              {...register("engineCapacity", {
                valueAsNumber: true,
              })}
            />

            {errors.engineCapacity && (
              <FieldError>{errors.engineCapacity.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Năm bắt đầu</FieldLabel>

            <Input
              type="number"
              {...register("yearFrom", {
                valueAsNumber: true,
              })}
            />
          </Field>

          <Field>
            <FieldLabel>Năm kết thúc</FieldLabel>

            <Input
              type="number"
              {...register("yearTo", {
                valueAsNumber: true,
              })}
            />
          </Field>
        </div>
      </FieldGroup>
    </EntityFormDialog>
  );
}
