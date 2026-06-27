import axiosPublic from "../axios/axiosPublic";
import type {
  Vehicle,
  VehicleQueryParams,
  PaginationResponse,
} from "@repo/types";

export const vehiclePublicApi = {
  // Lấy danh sách xe có phân trang thông thường
  async getVehicles(
    page: number,
    size: number,
  ): Promise<PaginationResponse<Vehicle>> {
    // CHÚ Ý: Chỉ truyền 1 tham số Vehicle vào PaginationResponse
    return axiosPublic.get<PaginationResponse<Vehicle>>("/vehicles", {
      params: { page, size },
    });
  },

  // Lấy thông tin chi tiết của một chiếc xe
  async getVehicleById(id: string): Promise<Vehicle> {
    // Bỏ tham số vế sau, chỉ giữ lại <Vehicle>
    return axiosPublic.get<Vehicle>(`/vehicles/${id}`);
  },

  // Lấy danh sách xe dựa theo bộ lọc chuyên sâu (Search, Filter, Sort...)
  async getVehicleFilters(
    params?: VehicleQueryParams,
  ): Promise<PaginationResponse<Vehicle>> {
    // CHÚ Ý: Chỉ truyền 1 tham số Vehicle vào PaginationResponse
    return axiosPublic.get<PaginationResponse<Vehicle>>("/vehicles/filters", {
      params,
    });
  },
};
