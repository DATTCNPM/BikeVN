import axiosAdmin from "../axios/axiosAdmin";
import type {
  ApiResponse,
  VehicleBrand,
  VehicleBrandCreationRequest,
  VehicleBrandUpdateRequest,
} from "@repo/types";

export const vehicleBrandAdminApi = {
  create(data: VehicleBrandCreationRequest) {
    return axiosAdmin.post<ApiResponse<VehicleBrand>>("/brand", data);
  },

  getAll() {
    return axiosAdmin.get<ApiResponse<VehicleBrand[]>>("/brand");
  },

  getById(id: number) {
    return axiosAdmin.get<ApiResponse<VehicleBrand>>(`/brand/${id}`);
  },

  update(id: number, data: VehicleBrandUpdateRequest) {
    return axiosAdmin.put<ApiResponse<VehicleBrand>>(`/brand/${id}`, data);
  },

  delete(id: number) {
    return axiosAdmin.delete<ApiResponse<void>>(`/brand/${id}`);
  },
};
