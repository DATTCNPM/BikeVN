import axiosAdmin from "../axios/axiosAdmin";
import type {
  Vehicle,
  VehicleCreationRequest,
  VehicleUpdateRequest,
} from "@repo/types";

export const vehicleAdminApi = {
  async createVehicle(payload: VehicleCreationRequest) {
    const data = await axiosAdmin.post<Vehicle>("/vehicles", payload);
    return {
      message: "Tạo xe thành công",
      vehicle: data,
    };
  },

  async updateVehicle(id: string, payload: VehicleUpdateRequest) {
    const data = await axiosAdmin.put<Vehicle>(`/vehicles/${id}`, payload);
    return {
      message: "Cập nhật xe thành công",
      vehicle: data,
    };
  },

  async deleteVehicle(id: string) {
    const data = await axiosAdmin.delete(`/vehicles/${id}`);
    return {
      message: data || "Xóa xe thành công",
    };
  },
};
