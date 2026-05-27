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

import { vehicleCreationSchema as vehicleSchema, type VehicleCreationFormValues as VehicleFormValues } from "@repo/schemas";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: VehicleFormValues = {
  name: "",
  
  
  licensePlate: "",
  color: "",
  year: new Date().getFullYear(),
  pricePerDay: 0,
  status: "available",
  
  vehicleType: "gasoline",
  mileage: 0,
  imageUrl: [""],
  description: "",
  currentBranchId: "",
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

            <Input {...register("currentBranchId")} placeholder="branch_01" />

            {errors.currentBranchId && (
              <FieldError>{errors.currentBranchId.message}</FieldError>
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

          <Field>
            <FieldLabel>Ảnh xe</FieldLabel>

            <Input
              {...register("imageUrl.0")}
              placeholder="https://example.com/car.jpg"
            />

            {errors.imageUrl?.[0] && (
              <FieldError>{errors.imageUrl[0].message}</FieldError>
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
