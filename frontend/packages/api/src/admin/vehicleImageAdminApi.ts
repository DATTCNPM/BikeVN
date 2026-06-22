import axiosAdmin from "../axios/axiosAdmin";

import type {
  VehicleImage,
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

    return response.data;
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

    formData.append("altText", payload.altText ?? "");
    formData.append("displayOrder", payload.displayOrder.toString());
    formData.append("isPrimary", payload.isPrimary.toString());

    const response = await axiosAdmin.put(
      `/vehicles/${vehicleId}/images/${imageId}`,
      formData,
    );

    return response.data;
  },

  async deleteImage(vehicleId: string, imageId: string) {
    await axiosAdmin.delete(`/vehicles/${vehicleId}/images/${imageId}`);
  },
};
