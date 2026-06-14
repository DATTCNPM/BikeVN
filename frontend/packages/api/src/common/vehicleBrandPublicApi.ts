import axiosPublic from "../axios/axiosPublic";
import type { VehicleBrand, PaginationResponse } from "@repo/types";

export const vehicleBrandPublicApi = {
  async getBrands() {
    const data = await axiosPublic.get<
      PaginationResponse<VehicleBrand>,
      PaginationResponse<VehicleBrand>
    >("/vehicle-brands");
    return data;
  },

  async getBrandById(id: number) {
    const data = await axiosPublic.get<VehicleBrand, VehicleBrand>(
      `/vehicle-brands/${id}`,
    );

    return data;
  },
};
