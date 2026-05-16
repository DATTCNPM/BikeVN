import { z } from "zod";

const optionalString = (schema: z.ZodString) => schema.or(z.literal(""));

export const loginSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = z.object({
  name: z.string().min(6, "Tên phải có ít nhất 6 ký tự"),
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
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

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Mật khẩu hiện tại phải có ít nhất 6 ký tự"),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmNewPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
});

export const bookingSchema = z
  .object({
    pickupBranchId: z.string().min(1, "Vui lòng chọn nơi nhận xe"),

    returnBranchId: z.string().min(1, "Vui lòng chọn nơi trả xe"),

    dateRange: z.object({
      from: z.date({
        message: "Vui lòng chọn ngày nhận xe",
      }),

      to: z.date({
        message: "Vui lòng chọn ngày trả xe",
      }),
    }),
  })
  .refine((data) => data.dateRange.to > data.dateRange.from, {
    message: "Ngày trả phải sau ngày nhận",
    path: ["dateRange"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
export type BookingSchema = z.infer<typeof bookingSchema>;
