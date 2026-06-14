import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import EntityFormDialog from "@/components/common/EntityFormDialog";

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

      toast.success("Tạo vai trò thành công");

      reset(defaultValues);
      onOpenChange(false);
    } catch {
      toast.error("Tạo vai trò thất bại");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Thêm vai trò"
      description="Tạo vai trò mới trong hệ thống"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Tạo"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Tên vai trò</FieldLabel>
          <Input {...register("name")} placeholder="manager" />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Mô tả</FieldLabel>
          <Input {...register("description")} placeholder="Quản lý hệ thống" />
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
    </EntityFormDialog>
  );
}
