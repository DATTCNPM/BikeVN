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

import { useCreateVehicleBrand } from "@/features/vehicleBrand/hooks/mutationVehicleBrand";

import { vehicleBrandCreationSchema } from "@repo/schemas";
import type { VehicleBrandCreationRequest } from "@repo/schemas";

import { isApiError } from "@repo/api";
import { handleFormBackendError } from "@repo/providers";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: VehicleBrandCreationRequest = {
  name: "",
  country: "",
};

export default function BrandCreate({ open, onOpenChange }: Props) {
  const { mutate: createVehicleBrand, isPending } = useCreateVehicleBrand();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<VehicleBrandCreationRequest>({
    resolver: zodResolver(vehicleBrandCreationSchema),
    defaultValues,
  });

  const onSubmit = (values: VehicleBrandCreationRequest) => {
    createVehicleBrand(values, {
      onSuccess: () => {
        toast.success("Vehicle brand created successfully");
        reset();
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
      title="Create Vehicle Brand"
      description="Create a new vehicle brand"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Create Brand"
      error={errors.root?.message}
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Brand Name</FieldLabel>

          <Input {...register("name")} placeholder="Honda" />

          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Country</FieldLabel>

          <Input {...register("country")} placeholder="Japan" />

          {errors.country && <FieldError>{errors.country.message}</FieldError>}
        </Field>
      </FieldGroup>
    </UniversalDialog>
  );
}
