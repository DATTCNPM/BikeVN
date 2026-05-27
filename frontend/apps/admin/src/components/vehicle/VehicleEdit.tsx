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

import { vehicleCreationSchema as vehicleSchema, type VehicleCreationFormValues as VehicleFormValues } from "@repo/schemas";

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
      
      
      licensePlate: vehicle.licensePlate,
      color: vehicle.color,
      year: vehicle.year,
      pricePerDay: vehicle.pricePerDay,
      status: vehicle.status,
      
      vehicleType: vehicle.vehicleType,
      mileage: vehicle.mileage,
      imageUrl: vehicle.imageUrl,
      description: vehicle.description ?? "",
      currentBranchId: vehicle.currentBranchId,
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

            <Input {...register("currentBranchId")} />

            {errors.currentBranchId && (
              <FieldError>{errors.currentBranchId.message}</FieldError>
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
              name="vehicleType"
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

            <Input {...register("imageUrl.0")} />

            {errors.imageUrl?.[0] && (
              <FieldError>{errors.imageUrl[0].message}</FieldError>
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
