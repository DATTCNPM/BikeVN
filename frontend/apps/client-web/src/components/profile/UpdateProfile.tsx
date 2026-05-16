import FormDialog from "../common/FormDialog";
import { updateProfileSchema } from "@repo/schemas";
import type { UpdateProfileSchema } from "@repo/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@repo/ui/components/input";
import {
  Field,
  FieldGroup,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@repo/ui/components/field";
import { toast } from "sonner";

import { useState } from "react";

import { useAuthStore } from "@/stores/useAuthStore";

type UpdateProfileProps = {
  trigger: React.ReactNode;
};

export default function UpdateProfile({ trigger }: UpdateProfileProps) {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.userProfile);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const methods = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      cccd_number: user?.cccd_number || "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const onSubmit = (data: UpdateProfileSchema) => {
    updateProfile(data).then((success) => {
      if (success) {
        toast.success("Cập nhật thông tin thành công!");
        setOpen(false);
      } else {
        toast.error("Cập nhật thông tin thất bại!");
      }
    });
  };

  return (
    <FormDialog
      trigger={trigger}
      open={open}
      onOpen={setOpen}
      title="Cập nhật thông tin cá nhân"
      description="Cập nhật thông tin định danh và liên lạc của bạn"
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      error={error}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Họ và tên</FieldLabel>
          <FieldContent>
            <Input
              type="text"
              id="name"
              placeholder={`${user?.name || "Nguyễn Văn A"}`}
              {...register("name")}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email liên hệ</FieldLabel>
          <FieldContent>
            <Input
              type="email"
              id="email"
              placeholder={`${user?.email || "nguyenvana@example.com"}`}
              {...register("email")}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Số điện thoại</FieldLabel>
          <FieldContent>
            <Input
              type="text"
              id="phone"
              placeholder={`${user?.phone || "0123456789"}`}
              {...register("phone")}
            />
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="cccd_number">Số CCCD</FieldLabel>
          <FieldContent>
            <Input
              type="text"
              id="cccd_number"
              placeholder={`${user?.cccd_number || "123456789"}`}
              {...register("cccd_number")}
            />
            {errors.cccd_number && (
              <FieldError>{errors.cccd_number.message}</FieldError>
            )}
          </FieldContent>
        </Field>
      </FieldGroup>
    </FormDialog>
  );
}
