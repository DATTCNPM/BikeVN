// @/pages/Register.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@repo/schemas";
import type { RegisterPayload } from "@repo/types";
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
import { useRegister } from "@/features/auth/useRegister";
import AuthCard from "@/features/auth/components/AuthCard";
import { isApiError } from "@repo/api";

export default function Register() {
  const navigate = useNavigate();
  // 🌟 Đồng bộ hóa: sử dụng mutate & đặt tên isPending giống bên Login
  const { mutate: registerUser, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError, // 🌟 Lấy hàm setError để map lỗi backend vào ô input
    formState: { errors },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      passwordHash: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterPayload) => {
    registerUser(data, {
      // 🌟 XỬ LÝ KHI ĐĂNG KÝ THÀNH CÔNG
      onSuccess: () => {
        navigate("/home");
      },
      // 🌟 XỬ LÝ KHI GẶP LỖI (Map lỗi backend tương tự Login)
      onError: (error: any) => {
        console.log("Register error:", error); // Log lỗi để debug

        if (isApiError(error)) {
          switch (error.code) {
            case 1001: // Giả định: Email already exists (Tùy thuộc backend code của bạn)
              setError("email", {
                type: "server",
                message: "Email này đã được sử dụng. Vui lòng chọn email khác.",
              });
              break;
            default:
              setError("root", {
                message:
                  error.message ||
                  "Đã xảy ra lỗi hệ thống khi đăng ký, vui lòng thử lại sau.",
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
      title="Register"
      description="Create your account"
      action="register"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup>
        {/* Name Input */}
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <FieldContent>
            <Input
              type="text"
              id="name"
              placeholder="John Doe"
              {...register("name")}
            />
          </FieldContent>
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        {/* Email Input */}
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

        {/* Password Input */}
        <Field className="relative">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <FieldContent>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="********"
              {...register("passwordHash")}
              className="pr-10" // Thêm padding phải tương tự Login để tránh text đè icon
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
          {errors.passwordHash && (
            <FieldError>{errors.passwordHash.message}</FieldError>
          )}
        </Field>

        {/* Confirm Password Input */}
        <Field className="relative">
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <FieldContent>
            <Input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="********"
              {...register("confirmPassword")}
              className="pr-10" // Thêm padding phải tương tự Login
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
          {errors.confirmPassword && (
            <FieldError>{errors.confirmPassword.message}</FieldError>
          )}
        </Field>

        {/* Register Button */}
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Registering..." : "Register"}
        </Button>

        {/* 🌟 Hiển thị lỗi chung hệ thống (nếu có) tương tự form Login */}
        {errors.root && (
          <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 rounded-xl border border-destructive/20 text-center">
            {errors.root.message}
          </div>
        )}
      </FieldGroup>
    </AuthCard>
  );
}
