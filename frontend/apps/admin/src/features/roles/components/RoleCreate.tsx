import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@repo/ui/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { toast } from "@repo/ui/components/ui/sonner";

import { roleCreationSchema } from "@repo/schemas";

import { useCreateRole } from "../hooks/mutationsRole";

import type { RoleRequest } from "@repo/schemas";
import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

import { isApiError } from "@repo/api";
import { handleFormBackendError } from "@repo/providers";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: RoleRequest = {
  name: "",
  description: "",
  permissions: [],
};

export default function RoleCreate({ open, onOpenChange }: Props) {
  const { mutate: createRole, isPending } = useCreateRole();

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<RoleRequest>({
    resolver: zodResolver(roleCreationSchema),
    defaultValues,
  });

  const onSubmit = (values: RoleRequest) => {
    createRole(values, {
      onSuccess: () => {
        toast.success("Role created successfully");
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
      title="Create Role"
      description="Create a new role in the system"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Create Role"
      error={errors.root?.message} // 🌟 Hiển thị lỗi chung hệ thống (mất mạng, concurrency, code 9999, 5050) nếu có
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Role Name</FieldLabel>
          <Input {...register("name")} placeholder="manager" />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input
            {...register("description")}
            placeholder="System administrator"
          />
          {errors.description && (
            <FieldError>{errors.description.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Permissions</FieldLabel>

          <Controller
            control={control}
            name="permissions"
            render={({ field }) => (
              <Input
                placeholder="user.read,user.create"
                value={field.value.join(",")}
                onChange={(e) =>
                  field.onChange(
                    e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  )
                }
              />
            )}
          />

          {errors.permissions && (
            <FieldError>{errors.permissions.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </UniversalDialog>
  );
}
