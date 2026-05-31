import axiosClient from "../axios/axiosClient";
import type { ApiResponse, Vehicle, VehicleQueryParams } from "@repo/types";

export const vehicleApi = {
  async getVehicles(params?: VehicleQueryParams): Promise<Vehicle[]> {
    const data = await axiosClient.get<any, ApiResponse<Vehicle[]>>(
      "/vehicle",
      {
        params,
      },
    );

    return data.result || [];
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    const data = await axiosClient.get<any, ApiResponse<Vehicle>>(
      `/vehicle/${id}`,
    );
    if (!data.result) {
      throw new Error("Xe không tồn tại");
    }
    return data.result;
  },
};
