// VehicleCreate.tsx

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

import { useCreateVehicle } from "@/features/vehicles/mutations";

import { vehicleSchema, type VehicleFormValues } from "@/features/vehicles/schemas";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: VehicleFormValues = {
  name: "",
  brand: "",
  model: "",
  license_plate: "",
  color: "",
  year: new Date().getFullYear(),
  price_per_day: 0,
  status: "available",
  engine_capacity: 1500,
  fuel_type: "gasoline",
  mileage: 0,
  image_url: [""],
  description: "",
  current_branch_id: "",
};

export default function VehicleCreate({ open, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useCreateVehicle();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues,
  });

  const onSubmit = async (values: VehicleFormValues) => {
    try {
      await mutateAsync(values);

      toast.success("Tạo xe thành công");

      reset(defaultValues);

      onOpenChange(false);
    } catch {
      toast.error("Tạo xe thất bại");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Thêm xe"
      description="Tạo xe mới trong hệ thống"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Tạo xe"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup>
          <Field>
            <FieldLabel>Tên xe</FieldLabel>

            <Input {...register("name")} placeholder="Toyota Vios" />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Hãng xe</FieldLabel>

            <Input {...register("brand")} placeholder="Toyota" />

            {errors.brand && <FieldError>{errors.brand.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Model</FieldLabel>

            <Input {...register("model")} placeholder="Vios 2024" />

            {errors.model && <FieldError>{errors.model.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Biển số</FieldLabel>

            <Input {...register("license_plate")} placeholder="51A-12345" />

            {errors.license_plate && (
              <FieldError>{errors.license_plate.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Màu sắc</FieldLabel>

            <Input {...register("color")} placeholder="Trắng" />

            {errors.color && <FieldError>{errors.color.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Năm sản xuất</FieldLabel>

            <Input
              type="number"
              {...register("year", {
                valueAsNumber: true,
              })}
            />

            {errors.year && <FieldError>{errors.year.message}</FieldError>}
          </Field>

          <Field>
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

          <Field>
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

          <Field>
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

          <Field>
            <FieldLabel>Chi nhánh</FieldLabel>

            <Input {...register("current_branch_id")} placeholder="branch_01" />

            {errors.current_branch_id && (
              <FieldError>{errors.current_branch_id.message}</FieldError>
            )}
          </Field>

          <Field>
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

          <Field>
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

          <Field>
            <FieldLabel>Ảnh xe</FieldLabel>

            <Input
              {...register("image_url.0")}
              placeholder="https://example.com/car.jpg"
            />

            {errors.image_url?.[0] && (
              <FieldError>{errors.image_url[0].message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Mô tả</FieldLabel>

            <Textarea {...register("description")} placeholder="Mô tả xe..." />

            {errors.description && (
              <FieldError>{errors.description.message}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </div>
    </EntityFormDialog>
  );
}
