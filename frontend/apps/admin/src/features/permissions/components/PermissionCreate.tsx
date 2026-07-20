import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

import { Input } from "@repo/ui/components/ui/input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";

import { toast } from "@repo/ui/components/ui/sonner";

import { permissionCreationSchema } from "@repo/schemas";

import { useCreatePermission } from "../hooks/mutationsPermission";

import type { PermissionRequest } from "@repo/schemas";

import { isApiError } from "@repo/api";
import { handleFormBackendError } from "@repo/providers";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: PermissionRequest = {
  name: "",
  description: "",
};

export default function PermissionCreate({ open, onOpenChange }: Props) {
  const { mutate: createPermission, isPending } = useCreatePermission();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PermissionRequest>({
    resolver: zodResolver(permissionCreationSchema),
    defaultValues,
  });

  const onSubmit = (values: PermissionRequest) => {
    createPermission(values, {
      onSuccess: () => {
        toast.success("Permission created successfully");
        reset(defaultValues);
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
      title="Create Permission"
      description="Create a new permission in the system"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Create"
      error={errors.root?.message} // 🌟 Hiển thị lỗi chung hệ thống (mất mạng, concurrency, code 9999, 5050) nếu có
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Permission Name</FieldLabel>
          <Input {...register("name")} placeholder="user.create" />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input
            {...register("description")}
            placeholder="Description of the permission"
          />
          {errors.description && (
            <FieldError>{errors.description.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </UniversalDialog>
  );
}
