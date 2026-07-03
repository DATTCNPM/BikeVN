import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

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

import { vehicleModelUpdateSchema } from "@repo/schemas";

import type { VehicleModelUpdateRequest } from "@repo/types";

import type { VehicleModel } from "@repo/types";

import { useUpdateVehicleModel } from "@/features/vehicleModel/mutationVehicleModel";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: VehicleModel | null;
};

export default function ModelEdit({ open, onOpenChange, model }: Props) {
  const { mutateAsync, isPending } = useUpdateVehicleModel();

  const { data: brands } = useVehicleBrands();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleModelUpdateRequest>({
    resolver: zodResolver(vehicleModelUpdateSchema),
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

  const onSubmit = async (values: VehicleModelUpdateRequest) => {
    if (!model) return;

    try {
      await mutateAsync({
        id: model.id,
        data: values,
      });

      toast.success("Update vehicle model successfully");

      onOpenChange(false);
    } catch {
      toast.error("Failed to update vehicle model");
    }
  };

  return (
    <UniversalDialog
      type="form"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Vehicle Model"
      description="Update vehicle model information"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Save Changes"
    >
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Model Name</FieldLabel>

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
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {brands?.data?.map((brand) => (
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
            <FieldLabel>Engine Capacity (cc)</FieldLabel>

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
            <FieldLabel>Year From</FieldLabel>

            <Input
              type="number"
              {...register("yearFrom", {
                valueAsNumber: true,
              })}
            />
            {errors.yearFrom && (
              <FieldError>{errors.yearFrom.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Year To</FieldLabel>

            <Input
              type="number"
              {...register("yearTo", {
                valueAsNumber: true,
              })}
            />
          </Field>
        </div>
      </FieldGroup>
    </UniversalDialog>
  );
}
