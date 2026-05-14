import AuthCard from "@/components/auth/AuthCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schema";
import type { RegisterSchema } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/stores/useAuthStore";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, loading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const methods = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const onSubmit = async (data: RegisterSchema) => {
    const success = await registerUser(data);
    if (success) {
      navigate("/login");
    }
  };

  return (
    <AuthCard
      title="Đăng ký"
      description="Đăng ký tài khoản của bạn"
      action="register"
      error={error}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup>
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
        <Field className="relative">
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <FieldContent>
            <Input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="********"
              {...register("confirmPassword")}
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
          {errors.confirmPassword && (
            <FieldError>{errors.confirmPassword.message}</FieldError>
          )}
        </Field>
        <Button type="submit" size="lg">
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner className="w-5 h-5" />
              Đang đăng ký...
            </span>
          ) : (
            "Đăng ký"
          )}
        </Button>
      </FieldGroup>
    </AuthCard>
  );
}
