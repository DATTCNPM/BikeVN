import axiosPublic from "../axios/axiosPublic";
import type { PaginationResponse } from "@repo/types";

import type { VehicleBrand, VehicleBrandQueryParams } from "@repo/schemas";

export const vehicleBrandPublicApi = {
  async getBrands(page: number, size: number) {
    console.log("GET BRANDS CALLED", page, size);
    const data = await axiosPublic.get<PaginationResponse<VehicleBrand>>(
      `/vehicle-brands?page=${page}&size=${size}`,
    );
    return data;
  },

  async getBrandById(id: number) {
    const data = await axiosPublic.get<VehicleBrand>(`/vehicle-brands/${id}`);

    return data;
  },

  // HÀM MỚI: Gọi tới endpoint filter trả về dữ liệu phân trang chuẩn
  async filterBrands(
    params: VehicleBrandQueryParams,
  ): Promise<PaginationResponse<VehicleBrand>> {
    const response = await axiosPublic.get<PaginationResponse<VehicleBrand>>(
      "/vehicle-brands/filter",
      { params },
    );
    return response;
  },
};
