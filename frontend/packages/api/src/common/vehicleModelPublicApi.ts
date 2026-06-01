import axiosPublic from "../axios/axiosPublic";
import type { ApiResponse, VehicleModel } from "@repo/types";

export const vehicleModelPublicApi = {
  async getModels(): Promise<VehicleModel[]> {
    const data = await axiosPublic.get<any, ApiResponse<VehicleModel[]>>(
      "/model",
    );
    console.log("Fetched models:", data.result);
    return data.result || [];
  },

  async getModelById(id: number): Promise<VehicleModel> {
    const data = await axiosPublic.get<any, ApiResponse<VehicleModel>>(
      `/model/${id}`,
    );
    console.log("Fetched model:", data.result);
    if (!data.result) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Dòng xe không tồn tại",
          },
        },
      };
    }
    return data.result;
  },
};
