import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";

import { toast } from "@repo/ui/components/ui/sonner";

import { useUploadVehicleImage } from "@/features/vehicleImages/hooks/mutationVehicleImage";

import { vehicleImageCreationSchema } from "@repo/schemas";
import type { VehicleImageCreatePayload } from "@repo/schemas";
import ImageUploadField from "@/components/common/ImageUploadField";

import { isApiError } from "@repo/api";
import { handleFormBackendError } from "@repo/providers";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
};

const defaultValues: VehicleImageCreatePayload = {
  imageUrl: [],
};

export default function ImageCreate({ open, onOpenChange, vehicleId }: Props) {
  const { mutate: uploadVehicleImage, isPending } = useUploadVehicleImage();

  const {
    control,
    handleSubmit,
    reset,
    setError,
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

  const onSubmit = (values: VehicleImageCreatePayload) => {
    uploadVehicleImage(
      { vehicleId, payload: values },
      {
        onSuccess: () => {
          toast.success("Vehicle image uploaded successfully");
          reset(defaultValues);
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
      title="Upload Vehicle Image"
      description="Upload a new image for the vehicle"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Upload"
      error={errors.root?.message}
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
    </UniversalDialog>
  );
}
