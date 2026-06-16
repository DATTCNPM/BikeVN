import axiosPublic from "../axios/axiosPublic";
import type {
  Vehicle,
  VehicleQueryParams,
  PaginationResponse,
} from "@repo/types";

export const vehiclePublicApi = {
  async getVehicles(page: number, pageSize: number) {
    const data = await axiosPublic.get<
      PaginationResponse<Vehicle>,
      PaginationResponse<Vehicle>
    >("/vehicles", {
      params: {
        page,
        pageSize,
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
    >("/vehicles/filters", {
      params,
    });

    return data;
  },
};
