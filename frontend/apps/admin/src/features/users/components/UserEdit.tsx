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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export default function UserEdit({ open, onOpenChange, user }: Props) {
  const { mutateAsync, isPending } = useUpdateUser();

  const {
    register,

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

  const onSubmit = async (values: UpdateUserPayload) => {
    if (!user) return;
    try {
      await mutateAsync({ id: user.id, payload: values });
      toast.success("Update user successfully");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update user");
    }
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
