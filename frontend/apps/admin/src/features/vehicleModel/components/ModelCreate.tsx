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

import { useCreateVehicleModel } from "@/features/vehicleModel/hooks/mutationVehicleModel";

import { vehicleModelCreationSchema } from "@repo/schemas";
import type { VehicleModelCreationRequest } from "@repo/schemas";
import { useVehicleBrands } from "@repo/hooks";

// 🌟 Import helper check error từ Packages hệ thống giống trang Login
import { isApiError } from "@repo/api";
import { handleFormBackendError } from "@repo/providers";

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
  // 🌟 Đổi tên thành createModel và sử dụng cấu trúc mutate
  const { mutate: createModel, isPending } = useCreateVehicleModel();
  const { data: brands } = useVehicleBrands(1, 100);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError, // 🌟 Lấy hàm setError để map lỗi backend vào từng ô input
    formState: { errors },
  } = useForm<VehicleModelCreationRequest>({
    resolver: zodResolver(vehicleModelCreationSchema),
    defaultValues,
  });

  const onSubmit = (values: VehicleModelCreationRequest) => {
    // 🌟 Chuyển sang sử dụng cấu trúc callback onSuccess/onError của mutate
    createModel(values, {
      onSuccess: () => {
        toast.success("Create vehicle model successfully");
        reset(defaultValues);
        onOpenChange(false);
      },
      onError: (error: unknown) => {
        // 🌟 Tự động phân tích payload lỗi backend và gán lỗi vào ô input phù hợp
        // Ví dụ: Lỗi 1010 (brandName/modelName đã tồn tại) sẽ được map đúng vào field tương ứng
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
      title="Create Vehicle Model"
      description="Create a new vehicle model"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Create Model"
      error={errors.root?.message} // 🌟 Hiển thị lỗi chung hệ thống (mất mạng, concurrency, code 9999, 5050) nếu có
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
