import axiosAdmin from "../axios/axiosAdmin";
import type {
  ApiResponse,
  VehicleModel,
  VehicleModelCreationRequest,
  VehicleModelUpdateRequest,
} from "@repo/types";

export const vehicleModelAdminApi = {
  create(data: VehicleModelCreationRequest) {
    return axiosAdmin.post<ApiResponse<VehicleModel>>("/model", data);
  },

  getAll() {
    return axiosAdmin.get<ApiResponse<VehicleModel[]>>("/model");
  },

  getById(id: number) {
    return axiosAdmin.get<ApiResponse<VehicleModel>>(`/model/${id}`);
  },

  update(id: number, data: VehicleModelUpdateRequest) {
    return axiosAdmin.put<ApiResponse<VehicleModel>>(`/model/${id}`, data);
  },

  delete(id: number) {
    return axiosAdmin.delete<ApiResponse<void>>(`/model/${id}`);
  },
};
