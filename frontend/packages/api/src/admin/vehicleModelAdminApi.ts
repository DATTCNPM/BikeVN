import axiosAdmin from "../axios/axiosAdmin";
import type {
  VehicleModel,
  VehicleModelCreationRequest,
  VehicleModelUpdateRequest,
} from "@repo/types";

export const vehicleModelAdminApi = {
  create(data: VehicleModelCreationRequest) {
    return axiosAdmin.post<VehicleModel>("/model", data);
  },

  getAll() {
    return axiosAdmin.get<VehicleModel[]>("/model");
  },

  getById(id: number) {
    return axiosAdmin.get<VehicleModel>(`/model/${id}`);
  },

  update(id: number, data: VehicleModelUpdateRequest) {
    return axiosAdmin.put<VehicleModel>(`/model/${id}`, data);
  },

  delete(id: number) {
    return axiosAdmin.delete(`/model/${id}`);
  },
};
