// @/pages/Login.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@repo/schemas";
import type { LoginPayload } from "@repo/types";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";

import { useNavigate } from "react-router-dom";
import { useLogin } from "@/features/auth/useLogin";
import AuthCard from "@/features/auth/components/AuthCard";
import { isApiError } from "@repo/api";

export default function Login() {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin(); // Chuyển từ mutateAsync sang mutate

  const pendingBooking = localStorage.getItem("pending-booking");
  const booking = pendingBooking ? JSON.parse(pendingBooking) : null;

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError, // 🌟 Lấy hàm setError để map lỗi backend vào ô input
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginPayload) => {
    login(data, {
      // 🌟 XỬ LÝ KHI THÀNH CÔNG (Điều hướng UI)
      onSuccess: () => {
        if (booking) {
          navigate(`/vehicles/${booking.vehicleId}`);
        } else {
          navigate("/home");
        }
      },
      onError: (error: any) => {
        console.log("Login error:", error); // Log lỗi để debug

        if (isApiError(error)) {
          switch (error.code) {
            case 1003: // Account does not exist
              setError("email", {
                type: "server",
                message: "Tài khoản email này không tồn tại trên hệ thống.",
              });
              break;
            case 1004: // Incorrect password
              setError("password", {
                type: "server",
                message: "Mật khẩu không chính xác. Vui lòng kiểm tra lại.",
              });
              break;
            default:
              setError("root", {
                message:
                  error.message ||
                  "Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.",
              });
          }
        } else {
          setError("root", {
            message: error.message || "Không thể kết nối đến máy chủ.",
          });
        }
      },
    });
  };

  return (
    <AuthCard
      title="Login"
      description="Login to your account"
      action="login"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldContent>
            <Input
              type="email"
              id="email"
              placeholder="user@example.com"
              {...register("email")}
            />
          </FieldContent>
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field className="relative">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <FieldContent>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="********"
              {...register("password")}
              className="pr-10" // Thêm padding phải để chữ không đè lên nút eye
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-7 right-1 h-8 w-8 p-0 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="size-4 text-muted-foreground" />
              ) : (
                <Eye className="size-4 text-muted-foreground" />
              )}
            </Button>
          </FieldContent>
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>
        {/* Hiển thị lỗi chung hệ thống nếu có (lỗi code 9999 hoặc mất mạng) */}
        {errors.root && (
          <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 rounded-xl border border-destructive/20 text-center">
            {errors.root.message}
          </div>
        )}
      </FieldGroup>
    </AuthCard>
  );
}
