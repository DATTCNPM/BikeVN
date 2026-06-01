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
import { useCreateVehicle } from "@/features/vehicles/mutations";
import { useBranches, useVehicleBrands, useVehicleModels } from "@repo/hooks";

import {
  vehicleCreationSchema as vehicleSchema,
  type VehicleCreationFormValues as VehicleFormValues,
} from "@repo/schemas";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: VehicleFormValues = {
  name: "",
  brandId: undefined as any,
  modelId: undefined as any,
  licensePlate: "",
  color: "",
  year: new Date().getFullYear(),
  pricePerDay: 0,
  status: "available",
  vehicleType: "fuel",
  mileage: 0,
  description: "",
  currentBranchId: "",
};

export default function VehicleCreate({ open, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useCreateVehicle();
  const { data: branches = [] } = useBranches();
  const { data: brands = [] } = useVehicleBrands();
  const { data: models = [] } = useVehicleModels();

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

  const selectedBrandId = useWatch({
    control,
    name: "brandId",
  });

  const filteredModels = models.filter((m) => m.brandId === selectedBrandId);

  const onSubmit = async (values: VehicleFormValues) => {
    console.log("Submitting vehicle:", values);
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
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Tên xe</FieldLabel>
            <Input {...register("name")} placeholder="Toyota Vios" />
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
                  onValueChange={(val) => {
                    field.onChange(Number(val));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hãng xe" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
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
            <FieldLabel>Dòng xe</FieldLabel>
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
            <Input {...register("licensePlate")} placeholder="51A-12345" />
            {errors.licensePlate && (
              <FieldError>{errors.licensePlate.message}</FieldError>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Màu sắc</FieldLabel>
            <Input {...register("color")} placeholder="Trắng" />
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
                <Select
                  value={field.value || ""}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chi nhánh" />
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
            <FieldLabel>Loại năng lượng</FieldLabel>
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
        </div>

        <Field>
          <FieldLabel>Mô tả</FieldLabel>
          <Textarea {...register("description")} placeholder="Mô tả xe..." />
          {errors.description && (
            <FieldError>{errors.description.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </EntityFormDialog>
  );
}
