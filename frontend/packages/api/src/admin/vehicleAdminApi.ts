import axiosAdmin from "../axios/axiosAdmin";
import type {
  ApiResponse,
  Vehicle,
  VehicleCreationRequest,
  VehicleUpdateRequest,
} from "@repo/types";

export const vehicleAdminApi = {
  async createVehicle(payload: VehicleCreationRequest) {
    const data = await axiosAdmin.post<Vehicle>("/vehicle", payload);
    return {
      message: "Tạo xe thành công",
      vehicle: data,
    };
  },

  async updateVehicle(
    id: string,
    payload: VehicleUpdateRequest,
  ) {
    const data = await axiosAdmin.put<Vehicle>(
      `/vehicle/${id}`,
      payload,
    );
    return {
      message: "Cập nhật xe thành công",
      vehicle: data,
    };
  },

  async deleteVehicle(id: string) {
    const data = await axiosAdmin.delete(
      `/vehicle/${id}`,
    );
    return {
      message: data || "Xóa xe thành công",
    };
  },
};
