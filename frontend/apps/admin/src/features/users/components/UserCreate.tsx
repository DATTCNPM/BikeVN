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

import { useCreateUser } from "@/features/users/hooks/mutations";
import { adminUserCreationSchema } from "@repo/schemas";
import type { AdminUserCreationPayload } from "@repo/types";

import { isApiError } from "@repo/api";
import { handleFormBackendError } from "@repo/providers";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: AdminUserCreationPayload = {
  name: "",
  email: "",
  passwordHash: "",
  phone: "",
  cccdNumber: "",
};

export default function UserCreate({ open, onOpenChange }: Props) {
  const { mutate: createUser, isPending } = useCreateUser();

  const {
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminUserCreationPayload>({
    resolver: zodResolver(adminUserCreationSchema),
    defaultValues,
  });

  const onSubmit = (values: AdminUserCreationPayload) => {
    createUser(values, {
      onSuccess: () => {
        toast.success("User created successfully");
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
      title="Create User"
      description="Create a new user in the system"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Create User"
      error={errors.root?.message} // 🌟 Hiển thị lỗi chung hệ thống (mất mạng, concurrency, code 9999, 5050) nếu có
    >
      <div className="grid gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input {...register("name")} placeholder="John Doe" />
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
            <FieldLabel>Password</FieldLabel>
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
            <FieldLabel>Phone</FieldLabel>
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
        </FieldGroup>
      </div>
    </UniversalDialog>
  );
}
