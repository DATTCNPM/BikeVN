import { useEffect } from "react";
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
import { useUpdateVehicle } from "@/features/vehicles/hooks/mutations";
import { useBranches, useVehicleBrands, useVehicleModels } from "@repo/hooks";

import type { Vehicle, VehicleUpdateRequest } from "@repo/types";
import { vehicleUpdateSchema, VEHICLE_STATUS_OPTIONS } from "@repo/schemas";

import { handleFormBackendError } from "@repo/providers";
import { isApiError } from "@repo/api";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
};

export default function VehicleEdit({ open, onOpenChange, vehicle }: Props) {
  const { mutate: updateVehicle, isPending } = useUpdateVehicle();
  const { data: branches = [] } = useBranches();
  const { data: brands } = useVehicleBrands();
  const { data: models } = useVehicleModels();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<VehicleUpdateRequest>({
    resolver: zodResolver(vehicleUpdateSchema),
  });

  // SỬA TẠI ĐÂY: Ép kiểu dữ liệu đồng bộ khi đổ từ API vào state của Form
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
      status: vehicle.status, // Đồng bộ chặt chẽ với vehicleStatusSchema
      vehicleType: vehicle.vehicleType,
      mileage: vehicle.mileage,
      description: vehicle.description ?? "",
      currentBranchId: vehicle.currentBranchId || "",
    });
  }, [vehicle, reset]);

  const selectedBrandId = useWatch({ control, name: "brandId" });
  const filteredModels = models?.data?.filter(
    (m) => m.brandId === Number(selectedBrandId),
  );

  const onSubmit = (values: VehicleUpdateRequest) => {
    if (!vehicle) return;

    const payload: VehicleUpdateRequest = {
      ...values,
      brandId: Number(values.brandId),
      modelId: Number(values.modelId),
    };

    updateVehicle(
      { id: vehicle.id, payload },
      {
        onSuccess: () => {
          toast.success("Update vehicle successfully");
          onOpenChange(false);
        },
        onError: (error: unknown) => {
          handleFormBackendError(error, setError, isApiError);
        },
      },
    );
  };

  return (
    <UniversalDialog
      type="form"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Vehicle"
      description="Update vehicle information"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Save Changes"
    >
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Vehicle Name</FieldLabel>
            <Input {...register("name")} />
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
            <Input {...register("licensePlate")} />
            {errors.licensePlate && (
              <FieldError>{errors.licensePlate.message}</FieldError>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Color</FieldLabel>
            <Input {...register("color")} />
            {errors.color && <FieldError>{errors.color.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Year</FieldLabel>
            <Input
              type="number"
              {...register("year", { valueAsNumber: true })}
            />
            {errors.year && <FieldError>{errors.year.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Price Per Day</FieldLabel>
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
            <FieldLabel>Status</FieldLabel>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
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
          <Textarea {...register("description")} />
          {errors.description && (
            <FieldError>{errors.description.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </UniversalDialog>
  );
}
