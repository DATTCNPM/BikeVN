import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Edit2,
  Moon,
  Sun,
  Lock,
  Trash2,
} from "lucide-react";

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
import { Button } from "@repo/ui/components/ui/button";
import { Switch } from "@repo/ui/components/ui/switch";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";
import UpdateProfile from "./UpdateProfile";

import { updatePasswordSchema } from "@repo/schemas";
import type { UpdatePasswordPayload } from "@repo/types";
import { useState } from "react";

interface AccountSettingsProps {
  user: any; // Thay bằng Type User của bạn
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const { theme, setTheme } = useTheme();
  const [openDelete, setOpenDelete] = useState(false);

  const methods = useForm<UpdatePasswordPayload>({
    resolver: zodResolver(updatePasswordSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onPasswordSubmit = (_data: UpdatePasswordPayload) => {
    toast.error("Feature not implemented yet");
  };

  const infoItems = [
    {
      icon: <User className="w-4 h-4 text-muted-foreground" />,
      label: "Full Name",
      value: user?.name || "Not updated",
    },
    {
      icon: <Mail className="w-4 h-4 text-muted-foreground" />,
      label: "Email",
      value: user?.email || "Not updated",
    },
    {
      icon: <Phone className="w-4 h-4 text-muted-foreground" />,
      label: "Phone Number",
      value: user?.phone || "Not updated",
    },
    {
      icon: <CreditCard className="w-4 h-4 text-muted-foreground" />,
      label: "ID Number",
      value: user?.cccdNumber || "Not updated",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
      {/* Cột trái: Thông tin cá nhân & Theme */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Profile Info</CardTitle>
              <UpdateProfile
                userProfile={user}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                }
              />
            </div>
            <CardDescription>Your personal identity details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {infoItems.map((item, index) => (
              <div key={index} className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                  {item.icon} {item.label}
                </span>
                <p className="text-sm font-semibold pl-5 text-foreground break-all">
                  {item.value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium flex items-center gap-2">
                {theme === "dark" ? (
                  <Moon size={16} className="text-blue-500" />
                ) : (
                  <Sun size={16} className="text-primary" />
                )}
                Display Mode
              </Label>
              <p className="text-xs text-muted-foreground">
                Switch light/dark theme.
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Cột phải: Bảo mật & Danger Zone */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock size={18} className="text-primary" /> Update Password
            </CardTitle>
            <CardDescription>
              Must be at least 8 characters with letters and numbers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup className="grid grid-cols-1 gap-4 space-y-0">
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
              <div className="hidden md:block" />
              <Field>
                <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
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
          <CardFooter className="bg-muted/10 py-3 flex justify-end">
            <Button size="sm" onClick={handleSubmit(onPasswordSubmit)}>
              Update Password
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-destructive/40 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-destructive text-lg flex items-center gap-2">
              <Trash2 size={18} /> Danger Zone
            </CardTitle>
            <CardDescription>
              Deleting your account will remove all your data permanently and
              cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <UniversalDialog
              type="confirm"
              submitLabel="Delete"
              trigger={
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              }
              variant="destructive"
              title="Confirm Account Deletion"
              description="Are you sure you want to delete your account? This action cannot be undone."
              onSubmit={() => {
                toast.error("Feature not implemented yet");
              }}
              open={openDelete}
              onOpenChange={setOpenDelete}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
