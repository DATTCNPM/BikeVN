import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ").optional(),
  cccd_number: z.string().min(9, "CCCD không hợp lệ").optional(),
  role: z.enum(["user", "admin"]),
});

export type UserFormValues = z.infer<typeof userSchema>;
