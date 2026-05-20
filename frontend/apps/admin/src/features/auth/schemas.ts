import { z } from "zod";

const optionalString = (schema: z.ZodString) => schema.or(z.literal(""));

export const loginSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const updateProfileSchema = z.object({
  name: optionalString(z.string().min(6, "Tên phải có ít nhất 6 ký tự")),
  email: z.email("Email không hợp lệ").or(z.literal("")),
  phone: optionalString(
    z.string().min(10, "Số điện thoại phải có ít nhất 10 chữ số"),
  ),
  cccd_number: optionalString(
    z.string().min(9, "Số CCCD phải có ít nhất 9 chữ số"),
  ),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
