import { z } from "zod";

const optionalString = (schema: z.ZodString) => schema.or(z.literal(""));

export const loginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "USER_INVALID"),
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
    password: z.string().min(6, "PASSWORD_INVALID"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
    phone: z.string().optional(),
    cccdNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const userCreationSchema = z.object({
  name: z.string().min(1, "USER_INVALID"),
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  passwordHash: z.string().min(6, "PASSWORD_INVALID"),
  phone: z.string().optional(),
  cccdNumber: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: optionalString(z.string().min(6, "Tên phải có ít nhất 6 ký tự")),
  email: z.string().email("Email không hợp lệ").or(z.literal("")),
  phone: optionalString(
    z.string().min(10, "Số điện thoại phải có ít nhất 10 chữ số"),
  ),
  cccdNumber: z.string().optional(),
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

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type UserCreationSchemaType = z.infer<typeof userCreationSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
