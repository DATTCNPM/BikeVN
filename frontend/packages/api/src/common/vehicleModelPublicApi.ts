import axiosPublic from "../axios/axiosPublic";
import type { VehicleModel, PaginationResponse } from "@repo/types";

export const vehicleModelPublicApi = {
  async getModels(page: number, size: number) {
    const data = await axiosPublic.get<
      PaginationResponse<VehicleModel>,
      PaginationResponse<VehicleModel>
    >(`/vehicle-models?page=${page}&size=${size}`);
    return data;
  },

  async getModelById(id: number) {
    const data = await axiosPublic.get<VehicleModel, VehicleModel>(
      `/vehicle-models/${id}`,
    );

    return data;
  },
};
