import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Họ tên là bắt buộc"),
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
    password: z.string().min(6, "PASSWORD_INVALID"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Mật khẩu hiện tại phải có ít nhất 6 ký tự"),

    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),

    confirmNewPassword: z
      .string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu mới xác nhận không khớp",
    path: ["confirmNewPassword"],
  });
