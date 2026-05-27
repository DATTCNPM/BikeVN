import axiosClient from "./axious";
import type { ApiResponse, Vehicle, VehicleCreationRequest, VehicleUpdateRequest } from "@repo/types";

export const vehicleApi = {
  async getVehicles(): Promise<Vehicle[]> {
    const data = await axiosClient.get<any, ApiResponse<Vehicle[]>>("/vehicle");
    return data.result || [];
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    const data = await axiosClient.get<any, ApiResponse<Vehicle>>(`/vehicle/${id}`);
    if (!data.result) {
      throw new Error("Xe không tồn tại");
    }
    return data.result;
  },

  async createVehicle(
    payload: VehicleCreationRequest,
  ): Promise<{ message: string; vehicle: Vehicle }> {
    const data = await axiosClient.post<any, ApiResponse<Vehicle>>("/vehicle", payload);
    return {
      message: data.message || "Thêm xe thành công",
      vehicle: data.result as Vehicle,
    };
  },

  async updateVehicle(
    id: string,
    payload: VehicleUpdateRequest,
  ): Promise<{ message: string; vehicle: Vehicle }> {
    const data = await axiosClient.put<any, ApiResponse<Vehicle>>(`/vehicle/${id}`, payload);
    return {
      message: data.message || "Cập nhật xe thành công",
      vehicle: data.result as Vehicle,
    };
  },

  async deleteVehicle(id: string): Promise<{ message: string }> {
    const data = await axiosClient.delete<any, ApiResponse<void>>(`/vehicle/${id}`);
    return {
      message: data.message || "Xóa xe thành công",
    };
  },
};
