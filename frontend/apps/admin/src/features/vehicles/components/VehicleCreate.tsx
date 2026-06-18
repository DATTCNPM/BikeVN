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

import { vehicleCreationSchema } from "@repo/schemas";
import type { VehicleCreationRequest } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: VehicleCreationRequest = {
  name: "",
  brandId: 0,
  modelId: 0,
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
  const { data: brands } = useVehicleBrands();
  const { data: models } = useVehicleModels();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleCreationRequest>({
    resolver: zodResolver(vehicleCreationSchema),
    defaultValues,
  });

  const selectedBrandId = useWatch({
    control,
    name: "brandId",
  });

  const filteredModels = models?.data?.filter(
    (m) => m.brandId === selectedBrandId,
  );

  const onSubmit = async (values: VehicleCreationRequest) => {
    console.log("Submitting vehicle:", values);
    try {
      await mutateAsync(values);
      toast.success("Create vehicle successfully");
      reset(defaultValues);
      onOpenChange(false);
    } catch {
      toast.error("Failed to create vehicle");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Vehicle"
      description="Create a new vehicle in the system"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Create Vehicle"
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
                  onValueChange={(val) => {
                    field.onChange(Number(val));
                  }}
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
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
    </EntityFormDialog>
  );
}
