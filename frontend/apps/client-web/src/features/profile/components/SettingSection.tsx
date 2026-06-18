import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@repo/ui/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Switch } from "@repo/ui/components/ui/switch";
import { Moon, Sun, Lock, Trash2 } from "lucide-react";
import AlertDialog from "@/components/common/AlertDialog";
import { toast } from "sonner";

import { updatePasswordSchema } from "@repo/schemas";
import type { UpdatePasswordPayload } from "@repo/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";

import { useDeleteUser } from "@/features/profile/useDeleteUser";
import { useProfile } from "@/features/profile/useProfile";

export default function SettingsSection() {
  const { theme, setTheme } = useTheme();
  const { data: profile } = useProfile();

  const { mutate: deleteUser } = useDeleteUser();

  const methods = useForm<UpdatePasswordPayload>({
    resolver: zodResolver(updatePasswordSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const onSubmit = (_data: UpdatePasswordPayload) => {
    toast.error("Feature not implemented yet");
  };

  const handleDeleteAccount = () => {
    // Gọi hàm xóa người dùng từ useDeleteUser
    deleteUser(profile?.id || ""); // Sử dụng ID từ profile nếu có
  };
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Customize the interface and secure your account.
        </p>
      </div>

      {/* Giao diện */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === "dark" ? (
              <Moon size={20} className="text-blue-500" />
            ) : (
              <Sun size={20} className="text-primary" />
            )}{" "}
            Display Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>
              Mode{" "}
              {theme === "dark" ? (
                <Moon size={20} className="text-blue-500" />
              ) : (
                <Sun size={20} className="text-primary" />
              )}
            </Label>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark mode.
            </p>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </CardContent>
      </Card>

      {/* Đổi mật khẩu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock size={20} className="text-primary" /> Update Password
          </CardTitle>
          <CardDescription>
            Your password should be at least 8 characters long and include both
            letters and numbers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="currentPassword">
                Current Password
              </FieldLabel>
              <FieldContent>
                <Input
                  id="currentPassword"
                  type="password"
                  {...register("currentPassword")}
                />
                {errors.currentPassword && (
                  <FieldError>{errors.currentPassword.message}</FieldError>
                )}
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="newPassword">Mật khẩu mới</FieldLabel>
              <FieldContent>
                <Input
                  id="newPassword"
                  type="password"
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <FieldError>{errors.newPassword.message}</FieldError>
                )}
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmNewPassword">
                Confirm New Password
              </FieldLabel>
              <FieldContent>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  {...register("confirmNewPassword")}
                />
                {errors.confirmNewPassword && (
                  <FieldError>{errors.confirmNewPassword.message}</FieldError>
                )}
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="bg-muted/20 py-4">
          <Button onClick={handleSubmit(onSubmit)}>Cập nhật mật khẩu</Button>
        </CardFooter>
      </Card>

      {/* Vùng nguy hiểm */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 size={20} /> Vùng nguy hiểm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Khi xóa tài khoản, toàn bộ dữ liệu của bạn sẽ bị gỡ bỏ vĩnh viễn
            khỏi hệ thống. Hành động này không thể hoàn tác.
          </p>
        </CardContent>
        <CardFooter>
          <AlertDialog
            trigger={<Button variant="destructive">Xóa tài khoản ngay</Button>}
            variant="destructive"
            title="Xác nhận xóa tài khoản"
            description="Bạn có chắc chắn muốn xóa tài khoản của mình không? Hành động này không thể hoàn tác."
            onConfirm={handleDeleteAccount}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
