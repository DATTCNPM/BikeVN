import AuthCard from "@/components/auth/AuthCard";
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
import { Spinner } from "@repo/ui/components/ui/spinner";

import { useNavigate } from "react-router-dom";

import { useLogin } from "@/features/auth/useLogin";
import { useAuthStore } from "@/features/auth/authStore";

export default function Login() {
  const navigate = useNavigate();
  const { mutateAsync: login, error, isPending } = useLogin();
  const { setIsLogin } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const methods = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const onSubmit = async (data: LoginPayload) => {
    const success = await login(data);
    if (success) {
      setIsLogin(true);
      navigate("/home");
    }
  };

  console.log("Login error:", error);

  return (
    <AuthCard
      title="Đăng nhập"
      description="Đăng nhập vào tài khoản của bạn"
      action="login"
      error={error}
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
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-7 right-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </FieldContent>
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <Spinner className="w-5 h-5" />
              Đang đăng nhập...
            </span>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </FieldGroup>
    </AuthCard>
  );
}
