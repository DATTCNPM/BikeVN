import AuthCard from "@/components/common/AuthCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schema";
import type { LoginSchema } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const methods = useForm<LoginSchema>({
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
  const onSubmit = (data: LoginSchema) => {
    console.log(data);
  };

  return (
    <AuthCard
      title="Đăng nhập"
      description="Đăng nhập vào tài khoản của bạn"
      action="login"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <div className="w-full items-center gap-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              type="email"
              id="email"
              placeholder="user@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div className="w-full items-center gap-2 relative">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="********"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-6 right-1"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
        <Button type="submit" size="lg">
          Đăng nhập
        </Button>
      </form>
    </AuthCard>
  );
}
