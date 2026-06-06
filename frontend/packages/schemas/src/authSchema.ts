import { z } from "zod";

const optionalString = (schema: z.ZodString) => schema.or(z.literal(""));
const userBaseSchema = z.object({
  name: z.string().min(1, "USER_INVALID"),
  email: z.string().email("Email không hợp lệ"),
  phone: optionalString(z.string().min(10, "Số điện thoại không hợp lệ")),
  cccdNumber: optionalString(z.string().min(9, "Số CCCD không hợp lệ")),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

export const registerSchema = userBaseSchema
  .extend({
    password: z.string().min(6, "PASSWORD_INVALID"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const userCreationSchema = userBaseSchema.extend({
  password: z.string().min(6, "PASSWORD_INVALID"),
});

export const adminUserCreationSchema = userCreationSchema.extend({
  role: z.enum(["user", "admin"]),
});

export const updateProfileSchema = userBaseSchema;

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
