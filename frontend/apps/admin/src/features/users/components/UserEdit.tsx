import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";
import { Input } from "@repo/ui/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { toast } from "@repo/ui/components/ui/sonner";

import { useUpdateUser } from "@/features/users/mutations";
import { updateUserSchema } from "@repo/schemas";
import type { UpdateUserPayload, User } from "@repo/types";

import { isApiError } from "@repo/api";
import { handleFormBackendError } from "@repo/providers";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export default function UserEdit({ open, onOpenChange, user }: Props) {
  const { mutate: updateUser, isPending } = useUpdateUser();

  const {
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserPayload>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      cccdNumber: user.cccdNumber || "",
    });
  }, [user, reset]);

  const onSubmit = (values: UpdateUserPayload) => {
    if (!user) return;
    updateUser({ id: user.id, payload: values }, {
      onSuccess: () => {
        toast.success("Update user successfully");
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
      title="Edit User"
      description="Update user information"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Save Changes"
      error={errors.root?.message} // 🌟 Hiển thị lỗi chung hệ thống (mất mạng, concurrency, code 9999, 5050) nếu có
    >
      <div className="grid gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input {...register("name")} />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input {...register("email")} type="email" />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input {...register("phone")} />
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>CCCD</FieldLabel>
            <Input {...register("cccdNumber")} />
            {errors.cccdNumber && (
              <FieldError>{errors.cccdNumber.message}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </div>
    </UniversalDialog>
  );
}
