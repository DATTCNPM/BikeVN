// vehicleModelPublicApi.ts
import axiosPublic from "../axios/axiosPublic";
import type {
  VehicleModel,
  PaginationResponse,
  VehicleModelQueryParams,
} from "@repo/types";

export const vehicleModelPublicApi = {
  async getModels(page: number, size: number) {
    const data = await axiosPublic.get<PaginationResponse<VehicleModel>>(
      `/vehicle-models?page=${page}&size=${size}`,
    );
    return data;
  },

  async getModelById(id: number) {
    const data = await axiosPublic.get<VehicleModel>(`/vehicle-models/${id}`);
    return data;
  },

  // HÀM MỚI: Gọi tới API @GetMapping("/filter") của Backend
  async filterModels(params: VehicleModelQueryParams) {
    const response = await axiosPublic.get<PaginationResponse<VehicleModel>>(
      "/vehicle-models/filter",
      { params }, // Axios tự động loại bỏ trường undefined và encode URL
    );
    return response;
  },
};
