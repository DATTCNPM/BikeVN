import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Lock, Trash2 } from "lucide-react";
import AlertDialog from "@/components/common/AlertDialog";

import { updatePasswordSchema } from "@/lib/schema";
import type { UpdatePasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function SettingsSection() {
  const methods = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const onSubmit = (data: UpdatePasswordSchema) => {
    console.log(data);
    // Here you would typically call an API to update the user's password
  };

  const handleDeleteAccount = () => {
    console.log("Account deleted");
    // Here you would typically call an API to delete the user's account
  };
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">
          Cài đặt
        </h1>
        <p className="text-muted-foreground mt-2">
          Tùy chỉnh giao diện và bảo mật tài khoản.
        </p>
      </div>

      {/* Giao diện */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun size={20} className="text-primary" /> Chế độ hiển thị
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Chế độ tối (Dark Mode)</Label>
            <p className="text-sm text-muted-foreground">
              Chuyển đổi giữa giao diện sáng và tối.
            </p>
          </div>
          <Switch />
        </CardContent>
      </Card>

      {/* Đổi mật khẩu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock size={20} className="text-primary" /> Đổi mật khẩu
          </CardTitle>
          <CardDescription>
            Mật khẩu nên có ít nhất 8 ký tự bao gồm chữ và số.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="currentPassword">
                Mật khẩu hiện tại
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
                Xác nhận mật khẩu mới
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
