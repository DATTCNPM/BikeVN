import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";
import { updateProfileSchema } from "@repo/schemas";
import type { UpdateProfilePayload, User } from "@repo/types";
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
import { useUpdateProfile } from "@/features/profile/useUpdateProfile";
import { handleFormBackendError } from "@repo/providers"; // 🌟 Import hàm helper dùng chung
import { isApiError } from "@repo/api";

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

  const {
    register,
    handleSubmit,
    reset,
    setError, // 🌟 Lấy ra setError để chuyển giao cho hàm helper map lỗi
    formState: { errors },
  } = useForm<UpdateProfilePayload>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: "", email: "", phone: "", cccdNumber: "" },
  });

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
    updateProfile(
      { userId: userProfile?.id || "", payload: data },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          setOpen(false);
        },
        onError: (error: unknown) => {
          // 🌟 TỰ ĐỘNG HOÀN TOÀN: Nếu trùng email (1002), lỗi tự nhảy vào ô Email
          handleFormBackendError(error, setError, isApiError);
        },
      },
    );
  };

  return (
    <UniversalDialog
      type="form"
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
      title="Update Profile"
      description="Update your personal information and contact details"
      onSubmit={handleSubmit(onSubmit)}
      loading={isUpdating}
      error={null}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <FieldContent>
            <Input type="text" id="name" {...register("name")} />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldContent>
            <Input type="email" id="email" {...register("email")} />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <FieldContent>
            <Input type="text" id="phone" {...register("phone")} />
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="cccdNumber">CCCD Number</FieldLabel>
          <FieldContent>
            <Input type="text" id="cccdNumber" {...register("cccdNumber")} />
            {errors.cccdNumber && (
              <FieldError>{errors.cccdNumber.message}</FieldError>
            )}
          </FieldContent>
        </Field>

        {/* 🌟 HIỂN THỊ LỖI CHUNG: Phòng trường hợp lỗi hệ thống phát sinh khi update */}
        {errors.root && (
          <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 rounded-xl border border-destructive/20 text-center">
            {errors.root.message}
          </div>
        )}
      </FieldGroup>
    </UniversalDialog>
  );
}
