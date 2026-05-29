import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

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
import { useBranches } from "@repo/hooks";

import type { Vehicle } from "@repo/types";
import {
  vehicleCreationSchema as vehicleSchema,
  type VehicleCreationFormValues as VehicleFormValues,
} from "@repo/schemas";
import { MOCK_BRANDS, MOCK_MODELS } from "@repo/api";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
};

export default function VehicleEdit({ open, onOpenChange, vehicle }: Props) {
  const { mutateAsync, isPending } = useUpdateVehicle();
  const { data: branches = [] } = useBranches();

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

    reset({
      name: vehicle.name,
      brandId: vehicle.brandId,
      modelId: vehicle.modelId,
      licensePlate: vehicle.licensePlate,
      color: vehicle.color,
      year: vehicle.year,
      pricePerDay: vehicle.pricePerDay,
      status: vehicle.status,
      vehicleType: vehicle.vehicleType,
      mileage: vehicle.mileage,
      imageUrl: vehicle.imageUrl || [""],
      description: vehicle.description ?? "",
      currentBranchId: vehicle.currentBranchId || "",
    });
  }, [vehicle, reset]);

  const selectedBrandId = useWatch({
    control,
    name: "brandId",
  });

  const filteredModels = MOCK_MODELS.filter(
    (m) => m.brandId === selectedBrandId,
  );

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
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Tên xe</FieldLabel>
            <Input {...register("name")} />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Hãng xe (Mock)</FieldLabel>
            <Controller
              control={control}
              name="brandId"
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hãng xe" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_BRANDS.map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>
                        {b.name}
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

          <Field>
            <FieldLabel>Dòng xe (Mock)</FieldLabel>
            <Controller
              control={control}
              name="modelId"
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(val) => field.onChange(Number(val))}
                  disabled={!selectedBrandId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn dòng xe" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredModels.map((m) => (
                      <SelectItem key={m.id} value={m.id.toString()}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.modelId && (
              <FieldError>{errors.modelId.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Biển số</FieldLabel>
            <Input {...register("licensePlate")} />
            {errors.licensePlate && (
              <FieldError>{errors.licensePlate.message}</FieldError>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Màu sắc</FieldLabel>
            <Input {...register("color")} />
            {errors.color && <FieldError>{errors.color.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Năm sản xuất</FieldLabel>
            <Input
              type="number"
              {...register("year", { valueAsNumber: true })}
            />
            {errors.year && <FieldError>{errors.year.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Giá thuê/ngày</FieldLabel>
            <Input
              type="number"
              {...register("pricePerDay", { valueAsNumber: true })}
            />
            {errors.pricePerDay && (
              <FieldError>{errors.pricePerDay.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Số km đã đi</FieldLabel>
            <Input
              type="number"
              {...register("mileage", { valueAsNumber: true })}
            />
            {errors.mileage && (
              <FieldError>{errors.mileage.message}</FieldError>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Chi nhánh</FieldLabel>
            <Controller
              control={control}
              name="currentBranchId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
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
                    <SelectItem value="fuel">Xăng/Dầu</SelectItem>
                    <SelectItem value="electric">Điện</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.vehicleType && (
              <FieldError>{errors.vehicleType.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Ảnh xe</FieldLabel>
            <Input {...register("imageUrl.0")} />
            {errors.imageUrl?.[0] && (
              <FieldError>{errors.imageUrl[0].message}</FieldError>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel>Mô tả</FieldLabel>
          <Textarea {...register("description")} />
          {errors.description && (
            <FieldError>{errors.description.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </EntityFormDialog>
  );
}
