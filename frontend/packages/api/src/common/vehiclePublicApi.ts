import axiosPublic from "../axios/axiosPublic";
import type { ApiResponse, Vehicle, VehicleQueryParams } from "@repo/types";

export const vehiclePublicApi = {
  async getVehicles(params?: VehicleQueryParams): Promise<Vehicle[]> {
    const data = await axiosPublic.get<any, ApiResponse<Vehicle[]>>(
      "/vehicle",
      {
        params,
      },
    );

    return data.result || [];
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    const data = await axiosPublic.get<any, ApiResponse<Vehicle>>(
      `/vehicle/${id}`,
    );
    if (!data.result) {
      throw new Error("Xe không tồn tại");
    }
    return data.result;
  },
};
