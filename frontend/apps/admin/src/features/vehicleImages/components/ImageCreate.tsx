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

import { vehicleImageSchema, type VehicleImageFormData } from "@repo/schemas";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
};

const defaultValues: VehicleImageFormData = {
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
  } = useForm<VehicleImageFormData>({
    resolver: zodResolver(vehicleImageSchema),
    defaultValues,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setValue("file", file);

    const url = URL.createObjectURL(file);

    setPreview(url);
  };

  const onSubmit = async (values: VehicleImageFormData) => {
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

      toast.success("Tải ảnh lên thành công");

      reset(defaultValues);

      setPreview(null);

      onOpenChange(false);
    } catch {
      toast.error("Tải ảnh lên thất bại");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Thêm ảnh xe"
      description="Tải ảnh mới cho xe"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Tải lên"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Chọn ảnh</FieldLabel>

          <Input type="file" accept="image/*" onChange={handleFileChange} />

          {errors.file && <FieldError>{errors.file.message}</FieldError>}
        </Field>

        {preview && (
          <Field>
            <FieldLabel>Xem trước</FieldLabel>

            <img
              src={preview}
              alt="Preview"
              className="h-48 w-full rounded-md border object-cover"
            />
          </Field>
        )}

        <Field>
          <FieldLabel>Mô tả ảnh</FieldLabel>

          <Input
            {...register("altText")}
            placeholder="Ví dụ: Góc nhìn phía trước"
          />

          {errors.altText && <FieldError>{errors.altText.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Thứ tự hiển thị</FieldLabel>

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
          <FieldLabel>Đặt làm ảnh chính</FieldLabel>
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
