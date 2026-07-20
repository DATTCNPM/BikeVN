import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    passwordHash: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.passwordHash === data.confirmPassword, {
    message: "Confirm password does not match",
    path: ["confirmPassword"],
  });

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters long"),

    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long"),

    confirmNewPassword: z
      .string()
      .min(6, "Confirm new password must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password confirmation does not match",
    path: ["confirmNewPassword"],
  });

export type LoginPayload = z.infer<typeof loginSchema>;

export type RegisterPayload = z.infer<typeof registerSchema>;

export type UpdatePasswordPayload = z.infer<typeof updatePasswordSchema>;
