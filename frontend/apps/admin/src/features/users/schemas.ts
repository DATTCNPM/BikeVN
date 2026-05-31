import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "USER_INVALID"),
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  passwordHash: z.string().min(6, "PASSWORD_INVALID"),
  phone: z.string().or(z.literal("")),
  cccdNumber: z.string().or(z.literal("")),
  role: z.enum(["user", "admin"]),
});

export const userSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ").or(z.literal("")),
  cccdNumber: z.string().min(9, "CCCD không hợp lệ").or(z.literal("")),
  role: z.enum(["user", "admin"]),
});

export type UserFormValues = z.infer<typeof userSchema>;
export type CreateUserValues = z.infer<typeof createUserSchema>;
