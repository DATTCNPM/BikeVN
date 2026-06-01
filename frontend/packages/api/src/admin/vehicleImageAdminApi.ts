import axiosAdmin from "../axios/axiosAdmin";

import type {
  ApiResponse,
  VehicleImage,
  VehicleImageCreatePayload,
  VehicleImageUpdatePayload,
} from "@repo/types";

export const vehicleImageAdminApi = {
  async uploadImage(
    vehicleId: string,
    payload: VehicleImageCreatePayload,
  ): Promise<VehicleImage> {
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

    const response = await axiosAdmin.post<any, ApiResponse<VehicleImage>>(
      `/vehicle/${vehicleId}/images`,
      formData,
    );

    return response.result;
  },

  async updateImage(
    vehicleId: string,
    imageId: string,
    payload: VehicleImageUpdatePayload,
  ): Promise<VehicleImage> {
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

    const response = await axiosAdmin.put<any, ApiResponse<VehicleImage>>(
      `/vehicle/${vehicleId}/images/${imageId}`,
      formData,
    );

    return response.result;
  },

  async deleteImage(vehicleId: string, imageId: string) {
    await axiosAdmin.delete(`/vehicle/${vehicleId}/images/${imageId}`);
  },
};
