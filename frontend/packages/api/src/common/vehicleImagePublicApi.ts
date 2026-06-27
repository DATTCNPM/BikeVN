import axiosPublic from "../axios/axiosPublic";

import type { VehicleImage } from "@repo/types";

export const vehicleImagePublicApi = {
  async getImages(vehicleId: string) {
    const response = await axiosPublic.get<VehicleImage[]>(
      `/vehicles/${vehicleId}/images`,
    );

    return response;
  },
};
