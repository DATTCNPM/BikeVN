import FormDialog from "@/components/common/FormDialog";
import { updateProfileSchema } from "@repo/schemas";
import type { UpdateProfilePayload } from "@repo/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@repo/ui/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { toast } from "sonner";

import { useEffect, useState } from "react";

import type { User } from "@repo/types";
import { useUpdateProfile } from "@/features/profile/useUpdateProfile";

type UpdateProfileProps = {
  userProfile: User;
  trigger: React.ReactNode;
};

export default function UpdateProfile({
  trigger,
  userProfile,
}: UpdateProfileProps) {
  const [open, setOpen] = useState(false);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const methods = useForm<UpdateProfilePayload>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cccdNumber: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  useEffect(() => {
    if (userProfile) {
      reset({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        cccdNumber: userProfile.cccdNumber || "",
      });
    }
  }, [userProfile, reset]);
  const onSubmit = (data: UpdateProfilePayload) => {
    console.log("Submitting update profile with data:", data);
    updateProfile(
      { userId: userProfile?.id || "", payload: data },
      {
        onSuccess: () => {
          toast.success("Cập nhật thông tin thành công");
          setOpen(false);
        },
        onError: () => {
          toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại.");
        },
      },
    );
  };

  return (
    <FormDialog
      trigger={trigger}
      open={open}
      onOpen={setOpen}
      title="Cập nhật thông tin cá nhân"
      description="Cập nhật thông tin định danh và liên lạc của bạn"
      onSubmit={handleSubmit(onSubmit)}
      loading={isUpdating}
      error={null}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Họ và tên</FieldLabel>
          <FieldContent>
            <Input
              type="text"
              id="name"
              placeholder={`${userProfile?.name || "Nguyễn Văn A"}`}
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
              placeholder={`${userProfile?.email || "nguyenvana@example.com"}`}
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
              placeholder={`${userProfile?.phone || "0123456789"}`}
              {...register("phone")}
            />
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="cccdNumber">Số CCCD</FieldLabel>
          <FieldContent>
            <Input
              type="text"
              id="cccdNumber"
              placeholder={`${userProfile?.cccdNumber || "123456789"}`}
              {...register("cccdNumber")}
            />
            {errors.cccdNumber && (
              <FieldError>{errors.cccdNumber.message}</FieldError>
            )}
          </FieldContent>
        </Field>
      </FieldGroup>
    </FormDialog>
  );
}
