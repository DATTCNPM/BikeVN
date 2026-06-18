import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import EntityFormDialog from "@/components/common/EntityFormDialog";

import { Input } from "@repo/ui/components/ui/input";
import { Checkbox } from "@repo/ui/components/ui/checkbox";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";

import { toast } from "@repo/ui/components/ui/sonner";

import { useUploadVehicleImage } from "@/features/vehicleImages/mutationVehicleImage";

import { vehicleImageCreationSchema } from "@repo/schemas";
import type { VehicleImageCreatePayload } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
};

const defaultValues: VehicleImageCreatePayload = {
  file: undefined as unknown as File,
  altText: "",
  displayOrder: 0,
  isPrimary: false,
};

export default function ImageCreate({ open, onOpenChange, vehicleId }: Props) {
  const { mutateAsync, isPending } = useUploadVehicleImage();

  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VehicleImageCreatePayload>({
    resolver: zodResolver(vehicleImageCreationSchema),
    defaultValues,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setValue("file", file);

    const url = URL.createObjectURL(file);

    setPreview(url);
  };

  const onSubmit = async (values: VehicleImageCreatePayload) => {
    try {
      await mutateAsync({
        vehicleId,

        payload: {
          file: values.file,
          altText: values.altText,
          displayOrder: values.displayOrder,
          isPrimary: values.isPrimary,
        },
      });

      toast.success("Upload image successfully");

      reset(defaultValues);

      setPreview(null);

      onOpenChange(false);
    } catch {
      toast.error("Failed to upload image");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Upload Vehicle Image"
      description="Upload a new image for the vehicle"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Upload"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Choose Image</FieldLabel>

          <Input type="file" accept="image/*" onChange={handleFileChange} />

          {errors.file && <FieldError>{errors.file.message}</FieldError>}
        </Field>

        {preview && (
          <Field>
            <FieldLabel>Preview</FieldLabel>

            <img
              src={preview}
              alt="Preview"
              className="h-48 w-full rounded-md border object-cover"
            />
          </Field>
        )}

        <Field>
          <FieldLabel>Image Description</FieldLabel>

          <Input {...register("altText")} placeholder="Example: Front view" />

          {errors.altText && <FieldError>{errors.altText.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Display Order</FieldLabel>

          <Input
            type="number"
            {...register("displayOrder", {
              valueAsNumber: true,
            })}
          />

          {errors.displayOrder && (
            <FieldError>{errors.displayOrder.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Set as Primary Image</FieldLabel>
          <div>
            <Controller
              control={control}
              name="isPrimary"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(Boolean(checked))
                  }
                />
              )}
            />
          </div>
        </Field>
      </FieldGroup>
    </EntityFormDialog>
  );
}
