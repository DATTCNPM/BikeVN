import { z } from "zod";

export const vehicleCreationSchema = z.object({
  name: z.string().min(1, "Tên xe không được để trống"),
  brandId: z.number().int().min(1, "Vui lòng chọn hãng xe"),
  modelId: z.number().int().min(1, "Vui lòng chọn dòng xe"),
  licensePlate: z.string().min(1, "Biển số xe không được để trống"),
  color: z.string().min(1, "Màu sắc không được để trống"),
  year: z
    .number()
    .int()
    .min(1900, "Năm sản xuất không hợp lệ")
    .max(new Date().getFullYear() + 1, "Năm sản xuất không hợp lệ"),
  pricePerDay: z.number().min(0, "Giá thuê phải lớn hơn hoặc bằng 0"),
  vehicleType: z.enum(["fuel", "electric"], {
    required_error: "Loại xe không hợp lệ",
  }),
  mileage: z.number().min(0, "Số ODO phải lớn hơn hoặc bằng 0"),
  description: z.string().optional(),
  status: z.enum(["available", "unavailable", "maintenance"], {
    required_error: "Trạng thái xe không hợp lệ",
  }),
  currentBranchId: z.string().min(1, "Vui lòng chọn chi nhánh"),
});

export const vehicleUpdateSchema = vehicleCreationSchema.partial();

export type VehicleCreationFormValues = z.infer<typeof vehicleCreationSchema>;
export type VehicleUpdateFormValues = z.infer<typeof vehicleUpdateSchema>;
