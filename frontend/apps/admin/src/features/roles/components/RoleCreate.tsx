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

import { useCreateRole } from "../mutationsRole";

import type { RoleRequest } from "@repo/types";
import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

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
  const { mutateAsync, isPending } = useCreateRole();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleRequest>({
    resolver: zodResolver(roleCreationSchema),
    defaultValues,
  });

  const onSubmit = async (values: RoleRequest) => {
    try {
      await mutateAsync(values);

      toast.success("Role created successfully");

      reset(defaultValues);
      onOpenChange(false);
    } catch {
      toast.error("Failed to create role");
    }
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
