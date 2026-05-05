import AuthCard from "@/components/common/AuthCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schema";
import type { RegisterSchema } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
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
  const onSubmit = (data: RegisterSchema) => {
    console.log(data);
  };

  return (
    <AuthCard
      title="Đăng ký"
      description="Đăng ký tài khoản của bạn"
      action="register"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <div className="w-full items-center gap-2">
          <div className="space-y-2">
            <Label htmlFor="name">Tên</Label>
            <Input
              type="text"
              id="name"
              placeholder="Tên"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
        </div>
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="grid w-full items-center gap-2 relative">
          <Label htmlFor="password">Password</Label>
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
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
        <div className="grid w-full items-center gap-2 relative">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
          <Input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
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
        <Button type="submit" className="w-full" size="lg">
          Đăng ký
        </Button>
      </form>
    </AuthCard>
  );
}
