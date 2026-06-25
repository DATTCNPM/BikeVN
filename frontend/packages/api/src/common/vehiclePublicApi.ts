import axiosPublic from "../axios/axiosPublic";
import type {
  Vehicle,
  VehicleQueryParams,
  PaginationResponse,
} from "@repo/types";

export const vehiclePublicApi = {
  async getVehicles(page: number, size: number) {
    const data = await axiosPublic.get<
      PaginationResponse<Vehicle>,
      PaginationResponse<Vehicle>
    >("/vehicles", {
      params: {
        page,
        size,
      },
    });
    return data;
  },

  async getVehicleById(id: string) {
    const data = await axiosPublic.get<Vehicle, Vehicle>(`/vehicles/${id}`);
    return data;
  },

  async getVehicleFilters(params?: VehicleQueryParams) {
    const data = await axiosPublic.get<
      PaginationResponse<Vehicle>,
      PaginationResponse<Vehicle>
    >("/vehicles/filter", {
      params,
    });

    return data;
  },
};
