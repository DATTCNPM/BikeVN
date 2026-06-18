import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import EntityFormDialog from "@/components/common/EntityFormDialog";

import { Input } from "@repo/ui/components/ui/input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";

import { toast } from "@repo/ui/components/ui/sonner";

import { useCreateVehicleBrand } from "@/features/vehicleBrand/mutationVehicleBrand";

import { vehicleBrandCreationSchema } from "@repo/schemas";
import type { VehicleBrandCreationRequest } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: VehicleBrandCreationRequest = {
  name: "",
  country: "",
};

export default function BrandCreate({ open, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useCreateVehicleBrand();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleBrandCreationRequest>({
    resolver: zodResolver(vehicleBrandCreationSchema),
    defaultValues,
  });

  const onSubmit = async (values: VehicleBrandCreationRequest) => {
    try {
      await mutateAsync(values);

      toast.success("Create vehicle brand successfully");

      reset(defaultValues);

      onOpenChange(false);
    } catch {
      toast.error("Failed to create vehicle brand");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Vehicle Brand"
      description="Create a new vehicle brand"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Create Brand"
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
    </EntityFormDialog>
  );
}
