import { useForm } from "react-hook-form";
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

import { permissionCreationSchema } from "@repo/schemas";

import { useCreatePermission } from "../mutationsPermission";

import type { PermissionRequest } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: PermissionRequest = {
  name: "",
  description: "",
};

export default function PermissionCreate({ open, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useCreatePermission();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermissionRequest>({
    resolver: zodResolver(permissionCreationSchema),
    defaultValues,
  });

  const onSubmit = async (values: PermissionRequest) => {
    try {
      await mutateAsync(values);

      toast.success("Tạo quyền thành công");

      reset(defaultValues);
      onOpenChange(false);
    } catch {
      toast.error("Tạo quyền thất bại");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Thêm quyền"
      description="Tạo quyền mới trong hệ thống"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Tạo"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Tên quyền</FieldLabel>
          <Input {...register("name")} placeholder="user.create" />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Mô tả</FieldLabel>
          <Input
            {...register("description")}
            placeholder="Cho phép tạo người dùng"
          />
          {errors.description && (
            <FieldError>{errors.description.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </EntityFormDialog>
  );
}
