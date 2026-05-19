import { z } from "zod";

export const branchSchema = z.object({
  name: z.string().min(2, "Tên chi nhánh phải có ít nhất 2 ký tự"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  lat: z.number({ required_error: "Vĩ độ là bắt buộc" }),
  lng: z.number({ required_error: "Kinh độ là bắt buộc" }),
  status: z.enum(["active", "inactive"]),
});

export type BranchFormValues = z.infer<typeof branchSchema>;
