import { vehicles } from "../data/VehicleData";
import type {
  Vehicle,
  VehicleQueryParams,
  PaginationResponse,
} from "@repo/types";

export const vehiclePublicApi = {
  async getVehicles(page: number, size: number): Promise<PaginationResponse<Vehicle>> {
    // Mock pagination logic
    const start = (page - 1) * size;
    const end = start + size;
    const paginatedData = vehicles.slice(start, end);

    return {
      data: paginatedData,
      totalElements: vehicles.length,
      currentPage: page,
      totalPages: Math.ceil(vehicles.length / size),
      pageSize: size,
    };
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    const vehicle = vehicles.find((v) => v.id === id);
    if (!vehicle) throw new Error("Vehicle not found in mock data");
    return vehicle;
  },

  async getVehicleFilters(params?: VehicleQueryParams): Promise<PaginationResponse<Vehicle>> {
    // Basic mock filter logic (search only for demo)
    let filtered = [...vehicles];
    if (params?.search) {
      filtered = filtered.filter(v => v.name.toLowerCase().includes(params.search!.toLowerCase()));
    }

    return {
      data: filtered,
      totalElements: filtered.length,
      currentPage: 1,
      totalPages: 1,
      pageSize: filtered.length,
    };
  },
};
