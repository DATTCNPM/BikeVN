import { axiosAdmin } from "@/hooks/axiosAdmin";
import type {
  VehicleBrand,
  VehicleBrandCreationRequest,
  VehicleBrandUpdateRequest,
} from "@repo/types";

export const vehicleBrandAdminApi = {
  create(data: VehicleBrandCreationRequest) {
    return axiosAdmin.post<VehicleBrand, VehicleBrandCreationRequest>(
      "/vehicle-brands",
      data,
    );
  },

  getAll() {
    return axiosAdmin.get<VehicleBrand[], VehicleBrand[]>("/vehicle-brands");
  },

  getById(id: number) {
    return axiosAdmin.get<VehicleBrand, VehicleBrand>(`/vehicle-brands/${id}`);
  },

  update(id: number, data: VehicleBrandUpdateRequest) {
    return axiosAdmin.put<VehicleBrand, VehicleBrandUpdateRequest>(
      `/vehicle-brands/${id}`,
      data,
    );
  },

  delete(id: number) {
    return axiosAdmin.delete(`/vehicle-brands/${id}`);
  },
};
