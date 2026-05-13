import FormDialog from "../common/FormDialog";
import { updateProfileSchema } from "@/lib/schema";
import type { UpdateProfileSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { user } from "@/constants/userSample";
import { useState } from "react";

type UpdateProfileProps = {
  trigger: React.ReactNode;
  alert: boolean;
  setAlert: (alert: boolean) => void;
};

export default function UpdateProfile({
  trigger,
  alert,
  setAlert,
}: UpdateProfileProps) {
  const [open, setOpen] = useState(false);
  const methods = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      cccd_number: user.cccd_number,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const onSubmit = (data: UpdateProfileSchema) => {
    console.log(data);
    // Here you would typically call an API to update the user's profile

    setOpen(false);
    setAlert(true);
  };

  return (
    <FormDialog
      trigger={trigger}
      open={open}
      onOpen={setOpen}
      title="Cập nhật thông tin cá nhân"
      description="Cập nhật thông tin định danh và liên lạc của bạn"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Họ và tên</FieldLabel>
          <FieldContent>
            <Input
              type="text"
              id="name"
              placeholder="Nguyễn Văn A"
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
              placeholder="nguyenvana@example.com"
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
              placeholder="0123456789"
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
              placeholder="123456789"
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
