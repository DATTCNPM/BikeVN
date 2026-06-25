import axiosAdmin from "../axios/axiosAdmin";

import type {
  VehicleImageCreatePayload,
  VehicleImageUpdatePayload,
} from "@repo/types";

export const vehicleImageAdminApi = {
  async uploadImage(vehicleId: string, payload: VehicleImageCreatePayload) {
    const formData = new FormData();

    payload.imageUrl.forEach((file) => {
      formData.append("files", file);
    });

    const response = await axiosAdmin.post(
      `/vehicles/${vehicleId}/images`,
      formData,
    );

    return response;
  },

  async editImage(
    vehicleId: string,
    imageId: string,
    payload: VehicleImageUpdatePayload,
  ) {
    const formData = new FormData();

    if (payload.imageUrl) {
      formData.append("file", payload.imageUrl);
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

    const response = await axiosAdmin.put(
      `/vehicles/${vehicleId}/images/${imageId}`,
      formData,
    );

    return response;
  },

  async deleteImage(vehicleId: string, imageId: string) {
    await axiosAdmin.delete(`/vehicles/${vehicleId}/images/${imageId}`);
  },
};
