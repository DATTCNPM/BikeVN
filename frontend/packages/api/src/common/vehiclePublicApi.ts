import axiosPublic from "../axios/axiosPublic";
import type {
  Vehicle,
  VehicleQueryParams,
  PaginationResponse,
} from "@repo/types";

export const vehiclePublicApi = {
  async getVehicles(params?: VehicleQueryParams) {
    const data = await axiosPublic.get<
      PaginationResponse<Vehicle>,
      PaginationResponse<Vehicle>
    >("/vehicles", {
      params,
    });

    return data;
  },

  async getVehicleById(id: string) {
    const data = await axiosPublic.get<Vehicle, Vehicle>(`/vehicles/${id}`);
    return data;
  },
};
