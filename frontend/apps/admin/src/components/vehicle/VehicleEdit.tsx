// VehicleEdit.tsx

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import EntityFormDialog from "@/components/common/EntityFormDialog";

import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";

import { toast } from "@repo/ui/components/ui/sonner";

import { useUpdateVehicle } from "@/features/vehicles/mutations";

import type { Vehicle } from "@repo/types";

import { vehicleSchema, type VehicleFormValues } from "@/features/vehicles/schemas";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
};

export default function VehicleEdit({ open, onOpenChange, vehicle }: Props) {
  const { mutateAsync, isPending } = useUpdateVehicle();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
  });

  useEffect(() => {
    if (!vehicle) return;

    const formValues: VehicleFormValues = {
      name: vehicle.name,
      brand: vehicle.brand,
      model: vehicle.model,
      license_plate: vehicle.license_plate,
      color: vehicle.color,
      year: vehicle.year,
      price_per_day: vehicle.price_per_day,
      status: vehicle.status,
      engine_capacity: vehicle.engine_capacity,
      fuel_type: vehicle.fuel_type,
      mileage: vehicle.mileage,
      image_url: vehicle.image_url,
      description: vehicle.description ?? "",
      current_branch_id: vehicle.current_branch_id,
    };

    reset(formValues);
  }, [vehicle, reset]);

  const onSubmit = async (values: VehicleFormValues) => {
    if (!vehicle) return;

    try {
      await mutateAsync({
        id: vehicle.id,
        payload: values,
      });

      toast.success("Cập nhật xe thành công");

      onOpenChange(false);
    } catch {
      toast.error("Cập nhật xe thất bại");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Chỉnh sửa xe"
      description="Cập nhật thông tin xe"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Lưu thay đổi"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup>
          <Field>
            <FieldLabel>Tên xe</FieldLabel>

            <Input {...register("name")} />

            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Hãng xe</FieldLabel>

            <Input {...register("brand")} />

            {errors.brand && <FieldError>{errors.brand.message}</FieldError>}
          </Field>

          <Field className="space-y-2">
            <FieldLabel>Model</FieldLabel>

            <Input {...register("model")} />

            {errors.model && <FieldError>{errors.model.message}</FieldError>}
          </Field>

          <Field className="space-y-2">
            <FieldLabel>Biển số</FieldLabel>

            <Input {...register("license_plate")} />

            {errors.license_plate && (
              <FieldError>{errors.license_plate.message}</FieldError>
            )}
          </Field>

          <Field className="space-y-2">
            <FieldLabel>Màu sắc</FieldLabel>

            <Input {...register("color")} />

            {errors.color && <FieldError>{errors.color.message}</FieldError>}
          </Field>

          <Field className="space-y-2">
            <FieldLabel>Năm sản xuất</FieldLabel>

            <Input
              type="number"
              {...register("year", {
                valueAsNumber: true,
              })}
            />

            {errors.year && <FieldError>{errors.year.message}</FieldError>}
          </Field>

          <Field className="space-y-2">
            <FieldLabel>Giá thuê/ngày</FieldLabel>

            <Input
              type="number"
              {...register("price_per_day", {
                valueAsNumber: true,
              })}
            />

            {errors.price_per_day && (
              <FieldError>{errors.price_per_day.message}</FieldError>
            )}
          </Field>

          <Field className="space-y-2">
            <FieldLabel>Dung tích động cơ (cc)</FieldLabel>

            <Input
              type="number"
              {...register("engine_capacity", {
                valueAsNumber: true,
              })}
            />

            {errors.engine_capacity && (
              <FieldError>{errors.engine_capacity.message}</FieldError>
            )}
          </Field>

          <Field className="space-y-2">
            <FieldLabel>Số km đã đi</FieldLabel>

            <Input
              type="number"
              {...register("mileage", {
                valueAsNumber: true,
              })}
            />

            {errors.mileage && (
              <FieldError>{errors.mileage.message}</FieldError>
            )}
          </Field>

          <Field className="space-y-2">
            <FieldLabel>Chi nhánh</FieldLabel>

            <Input {...register("current_branch_id")} />

            {errors.current_branch_id && (
              <FieldError>{errors.current_branch_id.message}</FieldError>
            )}
          </Field>

          <Field className="space-y-2">
            <FieldLabel>Trạng thái</FieldLabel>

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="available">Sẵn sàng</SelectItem>

                    <SelectItem value="unavailable">Không khả dụng</SelectItem>

                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field className="space-y-2">
            <FieldLabel>Loại nhiên liệu</FieldLabel>

            <Controller
              control={control}
              name="fuel_type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="gasoline">Xăng</SelectItem>

                    <SelectItem value="diesel">Dầu</SelectItem>

                    <SelectItem value="electric">Điện</SelectItem>

                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field className="space-y-2 sm:col-span-2">
            <FieldLabel>Ảnh xe</FieldLabel>

            <Input {...register("image_url.0")} />

            {errors.image_url?.[0] && (
              <FieldError>{errors.image_url[0].message}</FieldError>
            )}
          </Field>

          <Field className="space-y-2 sm:col-span-2">
            <FieldLabel>Mô tả</FieldLabel>

            <Textarea {...register("description")} />

            {errors.description && (
              <FieldError>{errors.description.message}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </div>
    </EntityFormDialog>
  );
}
