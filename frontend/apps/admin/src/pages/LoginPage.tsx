import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Home, ShieldCheck } from "lucide-react";

// Schemas & Stores
import { loginSchema } from "@repo/schemas";
import type { LoginPayload } from "@repo/types";

// UI Components từ Monorepo Monolith
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Spinner } from "@repo/ui/components/ui/spinner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@repo/ui/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";

import { useLoginPortal } from "@/features/auth/useLoginPortal";

export default function Login() {
  const { mutateAsync: loginPortal, isPending } = useLoginPortal();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginPayload) => {
    await loginPortal(data);
  };

  return (
    // Khung chứa căn giữa, bọc ngoài lớp bảo vệ mờ cao cấp kết hợp với Background xe của bạn
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-zinc-200/80 bg-white/90 shadow-2xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/80">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            {/* Logo nhận diện portal nghiêm túc */}
            <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
              <ShieldCheck className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Secure Portal
              </span>
            </div>
          </div>

          <CardTitle className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Login
          </CardTitle>
          <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            Admin Portal Login
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup className="space-y-3">
              {/* Trường Email */}
              <Field>
                <FieldLabel
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
                >
                  Email
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="email"
                    id="email"
                    placeholder="name@company.com"
                    className="focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400 border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/50"
                    {...register("email")}
                  />
                </FieldContent>
                {errors.email && (
                  <FieldError className="text-xs text-destructive mt-1">
                    {errors.email.message}
                  </FieldError>
                )}
              </Field>

              {/* Trường Mật khẩu */}
              <Field>
                <FieldLabel
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
                >
                  Password
                </FieldLabel>
                <FieldContent className="relative flex items-center">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    className="pr-10 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400 border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/50 w-full"
                    {...register("password")}
                  />
                  {/* Nút ẩn hiện mật khẩu định vị chính xác theo chiều dọc */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 h-8 w-8 text-zinc-400 hover:bg-transparent hover:text-zinc-600 dark:hover:text-zinc-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </FieldContent>
                {errors.password && (
                  <FieldError className="text-xs text-destructive mt-1">
                    {errors.password.message}
                  </FieldError>
                )}
              </Field>

              {/* Nút Submit hành động chính */}
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full mt-2 font-semibold bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400 transition-colors duration-200 shadow-lg shadow-zinc-950/10 dark:shadow-amber-500/5"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner className="h-4 w-4 animate-spin text-current" />
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-center border-t border-zinc-100 dark:border-zinc-800/60 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-amber-500 dark:text-zinc-400 dark:hover:text-amber-400 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            Return to Client Portal
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
