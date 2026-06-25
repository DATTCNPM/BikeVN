import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import EntityFormDialog from "@/components/common/EntityFormDialog";

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
import ImageUploadField from "@/components/common/ImageUploadField";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
};

const defaultValues: VehicleImageCreatePayload = {
  imageUrl: [],
};

export default function ImageCreate({ open, onOpenChange, vehicleId }: Props) {
  const { mutateAsync, isPending } = useUploadVehicleImage();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VehicleImageCreatePayload>({
    resolver: zodResolver(vehicleImageCreationSchema),
    defaultValues,
  });

  const files = useWatch({
    control,
    name: "imageUrl",
    defaultValue: [],
  });

  const onSubmit = async (values: VehicleImageCreatePayload) => {
    try {
      await mutateAsync({
        vehicleId,

        payload: {
          imageUrl: values.imageUrl,
        },
      });

      toast.success("Upload image successfully");

      reset(defaultValues);

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
          <FieldLabel>Choose Images</FieldLabel>

          <ImageUploadField
            multiple
            value={files}
            onChange={(selectedFiles) =>
              setValue("imageUrl", selectedFiles, {
                shouldValidate: true,
              })
            }
          />

          {errors.imageUrl && (
            <FieldError>{errors.imageUrl.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </EntityFormDialog>
  );
}
