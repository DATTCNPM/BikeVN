import axiosPublic from "../axios/axiosPublic";
import type { VehicleModel } from "@repo/types";

export const vehicleModelPublicApi = {
  async getModels() {
    const data = await axiosPublic.get<VehicleModel[], VehicleModel[]>(
      "/model",
    );
    console.log("Fetched models:", data);
    return data;
  },

  async getModelById(id: number) {
    const data = await axiosPublic.get<VehicleModel, VehicleModel>(
      `/model/${id}`,
    );

    return data;
  },
};
