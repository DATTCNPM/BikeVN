import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import EntityFormDialog from "@/components/common/EntityFormDialog";

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

import { useVehicleBrands } from "@repo/hooks";

import { vehicleModelCreationSchema } from "@repo/schemas";
import type { VehicleModelCreationRequest } from "@repo/types";

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

  const { data: brands } = useVehicleBrands();

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

      toast.success("Tạo model xe thành công");

      reset(defaultValues);

      onOpenChange(false);
    } catch {
      toast.error("Tạo model xe thất bại");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Thêm model xe"
      description="Tạo model xe mới"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Tạo"
    >
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Tên model xe</FieldLabel>

            <Input {...register("name")} placeholder="Wave Alpha" />

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
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hãng xe" />
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
            <FieldLabel>Dung tích động cơ (cc)</FieldLabel>

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
            <FieldLabel>Năm bắt đầu</FieldLabel>

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
            <FieldLabel>Năm kết thúc</FieldLabel>

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
    </EntityFormDialog>
  );
}
