import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

import { Input } from "@repo/ui/components/ui/input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";

import { toast } from "@repo/ui/components/ui/sonner";

import { useUpdateVehicleBrand } from "@/features/vehicleBrand/hooks/mutationVehicleBrand";

import type { VehicleBrand } from "@repo/types";

import { vehicleBrandUpdateSchema } from "@repo/schemas";
import type { VehicleBrandUpdateRequest } from "@repo/types";

import { isApiError } from "@repo/api";
import { handleFormBackendError } from "@repo/providers";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: VehicleBrand | null;
};

export default function BrandEdit({ open, onOpenChange, brand }: Props) {
  const { mutate: updateVehicleBrand, isPending } = useUpdateVehicleBrand();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<VehicleBrandUpdateRequest>({
    resolver: zodResolver(vehicleBrandUpdateSchema),
  });

  useEffect(() => {
    if (!brand) return;

    reset({
      name: brand.name,
      country: brand.country,
    });
  }, [brand, reset]);

  const onSubmit = (values: VehicleBrandUpdateRequest) => {
    if (!brand) return;

    updateVehicleBrand(
      {
        id: brand.id,
        data: values,
      },
      {
        onSuccess: () => {
          toast.success("Update vehicle brand successfully");
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
      title="Update Vehicle Brand"
      description="Update vehicle brand information"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Save Changes"
      error={errors.root?.message} // 🌟 Hiển thị lỗi chung hệ thống (mất mạng, concurrency, code 9999, 5050) nếu có
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Brand Name</FieldLabel>

          <Input {...register("name")} />

          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Country</FieldLabel>

          <Input {...register("country")} />

          {errors.country && <FieldError>{errors.country.message}</FieldError>}
        </Field>
      </FieldGroup>
    </UniversalDialog>
  );
}
