import { z } from "zod";

export const branchStatusSchema = z.enum(["active", "inactive"]);

export const createBranchSchema = z.object({
  name: z.string().min(2, "Tên chi nhánh phải có ít nhất 2 ký tự"),

  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),

  lat: z
    .number()
    .min(-90, "Vĩ độ phải từ -90 đến 90")
    .max(90, "Vĩ độ phải từ -90 đến 90"),

  lng: z
    .number()
    .min(-180, "Kinh độ phải từ -180 đến 180")
    .max(180, "Kinh độ phải từ -180 đến 180"),

  status: z.enum(["active", "inactive"]),
});

export const updateBranchSchema = createBranchSchema.partial();

export const branchSchema = createBranchSchema.extend({
  id: z.string(),

  createdAt: z.string().datetime().optional(),
});
