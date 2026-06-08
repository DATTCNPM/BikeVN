import axiosPublic from "../axios/axiosPublic";
import type { VehicleModel } from "@repo/types";

export const vehicleModelPublicApi = {
  async getModels() {
    const data = await axiosPublic.get<VehicleModel[], VehicleModel[]>(
      "/model",
    );
    console.log("Fetched models:", data);
    return data || [];
  },

  async getModelById(id: number) {
    const data = await axiosPublic.get<VehicleModel, VehicleModel>(
      `/model/${id}`,
    );
    console.log("Fetched model:", data);
    if (!data) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Dòng xe không tồn tại",
          },
        },
      };
    }
    return data;
  },
};
