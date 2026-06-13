import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import EntityFormDialog from "@/components/common/EntityFormDialog";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { toast } from "@repo/ui/components/ui/sonner";

import { useCreateEmployee } from "@/features/users/mutations";
import { adminEmployeeCreationSchema } from "@repo/schemas";
import type { AdminEmployeeCreationPayload } from "@repo/types";
import { useBranches } from "@repo/hooks";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: AdminEmployeeCreationPayload = {
  name: "",
  email: "",
  passwordHash: "",
  phone: "",
  cccdNumber: "",
  role: "employee",
  branchId: "",
};

export default function EmployeeCreate({ open, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useCreateEmployee();
  const { data: branches } = useBranches();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminEmployeeCreationPayload>({
    resolver: zodResolver(adminEmployeeCreationSchema),
    defaultValues,
  });

  const onSubmit = async (values: AdminEmployeeCreationPayload) => {
    try {
      await mutateAsync(values);
      toast.success("Tạo nhân viên thành công");
      reset(defaultValues);
      onOpenChange(false);
    } catch {
      toast.error("Tạo nhân viên thất bại");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Thêm nhân viên"
      description="Tạo nhân viên mới trong hệ thống"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Tạo"
    >
      <div className="grid gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel>Họ tên</FieldLabel>
            <Input {...register("name")} placeholder="Nguyễn Văn A" />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              {...register("email")}
              type="email"
              placeholder="email@example.com"
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Mật khẩu</FieldLabel>
            <Input
              {...register("passwordHash")}
              type="password"
              placeholder="********"
            />
            {errors.passwordHash && (
              <FieldError>{errors.passwordHash.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Số điện thoại</FieldLabel>
            <Input {...register("phone")} placeholder="0901234567" />
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>CCCD</FieldLabel>
            <Input {...register("cccdNumber")} placeholder="079203000123" />
            {errors.cccdNumber && (
              <FieldError>{errors.cccdNumber.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Vai trò</FieldLabel>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Nhân viên</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && <FieldError>{errors.role.message}</FieldError>}
          </Field>
          <Controller
            control={control}
            name="branchId"
            render={({ field }) => (
              <Field>
                <FieldLabel>Chi nhánh</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches?.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branchId && (
                  <FieldError>{errors.branchId.message}</FieldError>
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </div>
    </EntityFormDialog>
  );
}
