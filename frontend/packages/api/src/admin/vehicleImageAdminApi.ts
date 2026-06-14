import axiosAdmin from "../axios/axiosAdmin";

import type {
  VehicleImage,
  VehicleImageCreatePayload,
  VehicleImageUpdatePayload,
} from "@repo/types";

export const vehicleImageAdminApi = {
  async uploadImage(vehicleId: string, payload: VehicleImageCreatePayload) {
    const formData = new FormData();

    formData.append("file", payload.file);

    if (payload.altText) {
      formData.append("altText", payload.altText);
    }

    if (payload.displayOrder !== undefined) {
      formData.append("displayOrder", payload.displayOrder.toString());
    }

    if (payload.isPrimary !== undefined) {
      formData.append("isPrimary", payload.isPrimary.toString());
    }

    const response = await axiosAdmin.post<VehicleImage>(
      `/vehicles/${vehicleId}/images`,
      formData,
    );

    return response;
  },

  async updateImage(
    vehicleId: string,
    imageId: string,
    payload: VehicleImageUpdatePayload,
  ) {
    const formData = new FormData();

    if (payload.file) {
      formData.append("file", payload.file);
    }

    if (payload.altText !== undefined) {
      formData.append("altText", payload.altText);
    }

    if (payload.displayOrder !== undefined) {
      formData.append("displayOrder", payload.displayOrder.toString());
    }

    if (payload.isPrimary !== undefined) {
      formData.append("isPrimary", payload.isPrimary.toString());
    }

    const response = await axiosAdmin.put<VehicleImage>(
      `/vehicles/${vehicleId}/images/${imageId}`,
      formData,
    );

    return response;
  },

  async deleteImage(vehicleId: string, imageId: string) {
    await axiosAdmin.delete(`/vehicles/${vehicleId}/images/${imageId}`);
  },
};
