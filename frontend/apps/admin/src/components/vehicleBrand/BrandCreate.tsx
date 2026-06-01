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

import { useCreateVehicleBrand } from "@/features/vehicles/mutationVehicleBrand";

import { vehicleBrandSchema, type VehicleBrandFormData } from "@repo/schemas";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: VehicleBrandFormData = {
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
  } = useForm<VehicleBrandFormData>({
    resolver: zodResolver(vehicleBrandSchema),
    defaultValues,
  });

  const onSubmit = async (values: VehicleBrandFormData) => {
    try {
      await mutateAsync(values);

      toast.success("Tạo hãng xe thành công");

      reset(defaultValues);

      onOpenChange(false);
    } catch {
      toast.error("Tạo hãng xe thất bại");
    }
  };

    return (
      <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Thêm hãng xe"
      description="Tạo hãng xe mới"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Tạo"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Tên hãng xe</FieldLabel>

          <Input
            {...register("name")}
            placeholder="Honda"
          />

          {errors.name && (
            <FieldError>
              {errors.name.message}
            </FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Quốc gia</FieldLabel>

          <Input
            {...register("country")}
            placeholder="Japan"
          />

          {errors.country && (
            <FieldError>
              {errors.country.message}
            </FieldError>
          )}
        </Field>
      </FieldGroup>
    </EntityFormDialog>
    );
}
