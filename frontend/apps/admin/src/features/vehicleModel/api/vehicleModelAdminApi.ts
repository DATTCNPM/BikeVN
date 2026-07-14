import { axiosAdmin } from "@repo/api";
import type {
  VehicleModel,
  VehicleModelCreationRequest,
  VehicleModelUpdateRequest,
} from "@repo/types";

export const vehicleModelAdminApi = {
  create(data: VehicleModelCreationRequest) {
    return axiosAdmin.post<VehicleModel, VehicleModelCreationRequest>(
      "/vehicle-models",
      data,
    );
  },

  getAll() {
    return axiosAdmin.get<VehicleModel[], VehicleModel[]>("/vehicle-models");
  },

  getById(id: number) {
    return axiosAdmin.get<VehicleModel, VehicleModel>(`/vehicle-models/${id}`);
  },

  update(id: number, data: VehicleModelUpdateRequest) {
    return axiosAdmin.put<VehicleModel, VehicleModelUpdateRequest>(
      `/vehicle-models/${id}`,
      data,
    );
  },

  delete(id: number) {
    return axiosAdmin.delete(`/vehicle-models/${id}`);
  },
};
