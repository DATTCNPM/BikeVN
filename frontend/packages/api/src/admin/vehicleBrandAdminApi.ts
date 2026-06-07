import axiosAdmin from "../axios/axiosAdmin";
import type {
  VehicleBrand,
  VehicleBrandCreationRequest,
  VehicleBrandUpdateRequest,
} from "@repo/types";

export const vehicleBrandAdminApi = {
  create(data: VehicleBrandCreationRequest) {
    return axiosAdmin.post<VehicleBrand>("/brand", data);
  },

  getAll() {
    return axiosAdmin.get<VehicleBrand[]>("/brand");
  },

  getById(id: number) {
    return axiosAdmin.get<VehicleBrand>(`/brand/${id}`);
  },

  update(id: number, data: VehicleBrandUpdateRequest) {
    return axiosAdmin.put<VehicleBrand>(`/brand/${id}`, data);
  },

  delete(id: number) {
    return axiosAdmin.delete(`/brand/${id}`);
  },
};
