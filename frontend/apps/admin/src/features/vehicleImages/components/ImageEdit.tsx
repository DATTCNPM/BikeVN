import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

import { Input } from "@repo/ui/components/ui/input";
import { Checkbox } from "@repo/ui/components/ui/checkbox";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";

import { toast } from "@repo/ui/components/ui/sonner";

import { useUpdateVehicleImage } from "@/features/vehicleImages/mutationVehicleImage";

import { vehicleImageUpdateSchema } from "@repo/schemas";

import type { VehicleImage, VehicleImageUpdatePayload } from "@repo/types";

import { getImageUrl } from "@repo/utils";

type FormValues = VehicleImageUpdatePayload;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  image: VehicleImage | null;
};

export default function ImageEdit({
  open,
  onOpenChange,
  vehicleId,
  image,
}: Props) {
  const { mutateAsync, isPending } = useUpdateVehicleImage();

  const [preview, setPreview] = useState<string>("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(vehicleImageUpdateSchema),
  });

  useEffect(() => {
    if (!image) return;

    reset({
      altText: image.altText ?? "",
      displayOrder: image.displayOrder,
      isPrimary: image.isPrimary,
    });

    setPreview(getImageUrl(image.imageUrl));
  }, [image, reset]);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setValue("imageUrl", file, {
      shouldValidate: true,
    });

    setPreview((oldPreview) => {
      if (oldPreview.startsWith("blob:")) {
        URL.revokeObjectURL(oldPreview);
      }

      return URL.createObjectURL(file);
    });
  };

  const onSubmit = async (values: FormValues) => {
    console.log(values);
    if (!image) return;

    try {
      await mutateAsync({
        vehicleId,
        imageId: image.id,
        payload: values,
      });

      toast.success("Update image successfully");

      onOpenChange(false);
    } catch {
      toast.error("Failed to update image");
    }
  };

  return (
    <UniversalDialog
      type="form"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Image"
      description="Update image information"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Save Changes"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Change Image</FieldLabel>

          <Input type="file" accept="image/*" onChange={handleFileChange} />

          {errors.imageUrl && (
            <FieldError>{errors.imageUrl.message}</FieldError>
          )}
        </Field>

        {preview && (
          <Field>
            <FieldLabel>Preview</FieldLabel>

            <img
              src={preview}
              alt="preview"
              className="h-56 w-full rounded-md border object-cover"
            />
          </Field>
        )}

        <Field>
          <FieldLabel>Image Description</FieldLabel>

          <Input
            {...register("altText")}
            placeholder="Example: Left side view"
          />

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
          <FieldLabel>Primary Image</FieldLabel>

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
    </UniversalDialog>
  );
}
