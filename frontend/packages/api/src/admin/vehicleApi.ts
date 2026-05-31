import axiosAdmin from "../axios/axiosAdmin";
import type {
  ApiResponse,
  Vehicle,
  VehicleCreationRequest,
  VehicleUpdateRequest,
  VehicleQueryParams,
} from "@repo/types";

export const vehicleAdminApi = {
  async getVehicles(params?: VehicleQueryParams): Promise<Vehicle[]> {
    const data = await axiosAdmin.get<any, ApiResponse<Vehicle[]>>("/vehicle", {
      params,
    });

    return data.result || [];
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    const data = await axiosAdmin.get<any, ApiResponse<Vehicle>>(
      `/vehicle/${id}`,
    );
    if (!data.result) {
      throw new Error("Xe không tồn tại");
    }
    return data.result;
  },

  async createVehicle(
    payload: VehicleCreationRequest,
  ): Promise<{ message: string; vehicle: Vehicle }> {
    const data = await axiosAdmin.post<any, ApiResponse<Vehicle>>(
      "/vehicle",
      payload,
    );
    return {
      message: data.message || "Thêm xe thành công",
      vehicle: data.result as Vehicle,
    };
  },

  async updateVehicle(
    id: string,
    payload: VehicleUpdateRequest,
  ): Promise<{ message: string; vehicle: Vehicle }> {
    const data = await axiosAdmin.put<any, ApiResponse<Vehicle>>(
      `/vehicle/${id}`,
      payload,
    );
    return {
      message: data.message || "Cập nhật xe thành công",
      vehicle: data.result as Vehicle,
    };
  },

  async deleteVehicle(id: string): Promise<{ message: string }> {
    const data = await axiosAdmin.delete<any, ApiResponse<void>>(
      `/vehicle/${id}`,
    );
    return {
      message: data.message || "Xóa xe thành công",
    };
  },
};
