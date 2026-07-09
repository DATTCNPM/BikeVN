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
  const { mutate: registerUser, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
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
      onSuccess: () => {
        navigate("/home");
      },
      onError: (error: unknown) => {
        // 🌟 SỬA ĐỔI: Thay any bằng unknown
        console.log("Register error:", error);

        if (isApiError(error)) {
          switch (error.code) {
            case 1002: // 🌟 SỬA ĐỔI: Đồng bộ đúng mã 1002 (Email đã tồn tại)
              setError("email", {
                type: "server",
                message: "Email already exists. Please use a different email.",
              });
              break;
            default:
              setError("root", {
                message:
                  error.message ||
                  "An error occurred while registering. Please try again later.",
              });
          }
        } else {
          const err = error as Error;
          setError("root", {
            message: err.message || "Unable to connect to the server.",
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
              className="pr-10"
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
              className="pr-10"
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

        {/* Hiển thị lỗi chung hệ thống */}
        {errors.root && (
          <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 rounded-xl border border-destructive/20 text-center">
            {errors.root.message}
          </div>
        )}
      </FieldGroup>
    </AuthCard>
  );
}
