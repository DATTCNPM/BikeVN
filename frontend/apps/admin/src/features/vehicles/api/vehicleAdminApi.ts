import { axiosAdmin } from "@/hooks/axiosAdmin";
import type {
  Vehicle,
  VehicleCreationRequest,
  VehicleUpdateRequest,
} from "@repo/schemas";

export const vehicleAdminApi = {
  async createVehicle(payload: VehicleCreationRequest) {
    const data = await axiosAdmin.post<Vehicle>("/vehicles", payload);
    return data;
  },

  async updateVehicle(id: string, payload: VehicleUpdateRequest) {
    const data = await axiosAdmin.put<Vehicle>(`/vehicles/${id}`, payload);
    return data;
  },

  async deleteVehicle(id: string) {
    const data = await axiosAdmin.delete(`/vehicles/${id}`);
    return data;
  },
};
