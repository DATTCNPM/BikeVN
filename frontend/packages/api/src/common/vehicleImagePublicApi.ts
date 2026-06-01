import axiosPublic from "../axios/axiosPublic";

import type { ApiResponse, VehicleImage } from "@repo/types";

export const vehicleImagePublicApi = {
  async getImages(vehicleId: string): Promise<VehicleImage[]> {
    const response = await axiosPublic.get<any, ApiResponse<VehicleImage[]>>(
      `/vehicle/${vehicleId}/images`,
    );

    return response.result || [];
  },
};
