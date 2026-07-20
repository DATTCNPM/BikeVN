import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

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
import { useCreateVehicle } from "@/features/vehicles/hooks/mutations";
import { useBranches, useVehicleBrands, useVehicleModels } from "@repo/hooks";

import { vehicleCreationSchema, VEHICLE_STATUS_OPTIONS } from "@repo/schemas";
import type { VehicleCreationRequest } from "@repo/types";

import { isApiError } from "@repo/api";
import { handleFormBackendError } from "@repo/providers";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues = {
  name: "",
  brandId: "" as unknown as number, // Trick ép kiểu ban đầu để không dính lỗi Zod số 0
  modelId: "" as unknown as number,
  licensePlate: "",
  color: "",
  year: new Date().getFullYear(),
  pricePerDay: 0,
  status: "available" as const,
  vehicleType: "fuel" as const,
  mileage: 0,
  description: "",
  currentBranchId: "",
};

export default function VehicleCreate({ open, onOpenChange }: Props) {
  const { mutate: createVehicle, isPending } = useCreateVehicle(); // 🌟 Đổi sang dùng mutate đồng bộ
  const { data: branches = [] } = useBranches();
  const { data: brands } = useVehicleBrands(1, 100);
  const { data: models } = useVehicleModels(1, 100);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<VehicleCreationRequest>({
    resolver: zodResolver(vehicleCreationSchema),
    defaultValues,
  });

  const selectedBrandId = useWatch({ control, name: "brandId" });
  const filteredModels = models?.data?.filter(
    (m) => m.brandId === Number(selectedBrandId),
  );

  const onSubmit = (values: VehicleCreationRequest) => {
    // Đảm bảo dữ liệu gửi lên API luôn là Number nguyên bản
    const payload = {
      ...values,
      brandId: Number(values.brandId),
      modelId: Number(values.modelId),
    };

    createVehicle(payload, {
      onSuccess: () => {
        toast.success("Create vehicle successfully");
        reset(defaultValues);
        onOpenChange(false);
      },
      onError: (error: unknown) => {
        handleFormBackendError(error, setError, isApiError);
      },
    });
  };

  return (
    <UniversalDialog
      type="form"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Create Vehicle"
      description="Create a new vehicle in the system"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Create Vehicle"
      error={errors.root?.message} // 🌟 Hiển thị lỗi chung hệ thống (mất mạng, concurrency, code 9999, 5050) nếu có
    >
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Vehicle Name</FieldLabel>
            <Input {...register("name")} placeholder="Toyota Vios" />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Brand</FieldLabel>
            <Controller
              control={control}
              name="brandId"
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands?.data?.map((b) => (
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
            <FieldLabel>Model</FieldLabel>
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
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredModels?.map((m) => (
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
            <FieldLabel>License Plate</FieldLabel>
            <Input {...register("licensePlate")} placeholder="51A-12345" />
            {errors.licensePlate && (
              <FieldError>{errors.licensePlate.message}</FieldError>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Color</FieldLabel>
            <Input {...register("color")} placeholder="Trắng" />
            {errors.color && <FieldError>{errors.color.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Year of Manufacture</FieldLabel>
            <Input
              type="number"
              {...register("year", { valueAsNumber: true })}
            />
            {errors.year && <FieldError>{errors.year.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Price per Day</FieldLabel>
            <Input
              type="number"
              {...register("pricePerDay", { valueAsNumber: true })}
            />
            {errors.pricePerDay && (
              <FieldError>{errors.pricePerDay.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Mileage</FieldLabel>
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
            <FieldLabel>Branch</FieldLabel>
            <Controller
              control={control}
              name="currentBranchId"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch" />
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
            <FieldLabel>Status</FieldLabel>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Energy Type</FieldLabel>
            <Controller
              control={control}
              name="vehicleType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fuel">Fuel</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
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
          <FieldLabel>Description</FieldLabel>
          <Textarea
            {...register("description")}
            placeholder="Vehicle description..."
          />
          {errors.description && (
            <FieldError>{errors.description.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </UniversalDialog>
  );
}
