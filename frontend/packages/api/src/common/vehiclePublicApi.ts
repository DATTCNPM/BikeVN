import axiosPublic from "../axios/axiosPublic";
import type { Vehicle, VehicleQueryParams } from "@repo/types";

export const vehiclePublicApi = {
  async getVehicles(params?: VehicleQueryParams) {
    const data = await axiosPublic.get<Vehicle[], Vehicle[]>("/vehicle", {
      params,
    });

    return data || [];
  },

  async getVehicleById(id: string) {
    const data = await axiosPublic.get<Vehicle, Vehicle>(`/vehicle/${id}`);
    if (!data) {
      throw new Error("Xe không tồn tại");
    }
    return data;
  },
};
