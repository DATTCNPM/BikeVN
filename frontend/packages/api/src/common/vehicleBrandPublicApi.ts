import axiosPublic from "../axios/axiosPublic";
import type { ApiResponse, VehicleBrand } from "@repo/types";

export const vehicleBrandPublicApi = {
  getAll() {
    return axiosPublic.get<ApiResponse<VehicleBrand[]>>("/brand");
  },

  getById(id: number) {
    return axiosPublic.get<ApiResponse<VehicleBrand>>(`/brand/${id}`);
  },
};
