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

import { useCreateVehicleModel } from "@/features/vehicleModel/mutationVehicleModel";

import { vehicleModelCreationSchema } from "@repo/schemas";
import type { VehicleModelCreationRequest } from "@repo/types";
import { useVehicleBrands } from "@repo/hooks";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: VehicleModelCreationRequest = {
  name: "",
  brandId: 0,
  engineCapacity: 110,
  yearFrom: undefined,
  yearTo: undefined,
};

export default function ModelCreate({ open, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useCreateVehicleModel();
  const { data: brands } = useVehicleBrands(1, 100);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleModelCreationRequest>({
    resolver: zodResolver(vehicleModelCreationSchema),
    defaultValues,
  });

  const onSubmit = async (values: VehicleModelCreationRequest) => {
    try {
      await mutateAsync(values);

      toast.success("Create vehicle model successfully");

      reset(defaultValues);

      onOpenChange(false);
    } catch {
      toast.error("Failed to create vehicle model");
    }
  };

  return (
    <UniversalDialog
      type="form"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Create Vehicle Model"
      description="Create a new vehicle model"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Create Model"
    >
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Model Name</FieldLabel>

            <Input {...register("name")} placeholder="Wave Alpha" />

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
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>

                  <SelectContent>
                    {brands?.data.map((brand) => (
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
              placeholder="2018"
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
              placeholder="2025"
              {...register("yearTo", {
                valueAsNumber: true,
              })}
            />

            {errors.yearTo && <FieldError>{errors.yearTo.message}</FieldError>}
          </Field>
        </div>
      </FieldGroup>
    </UniversalDialog>
  );
}
