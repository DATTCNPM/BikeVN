import axiosPublic from "../axios/axiosPublic";
import type { ApiResponse, VehicleBrand } from "@repo/types";

export const vehicleBrandPublicApi = {
  async getBrands(): Promise<VehicleBrand[]> {
    const data = await axiosPublic.get<any, ApiResponse<VehicleBrand[]>>(
      "/brand",
    );
    console.log("Fetched brands:", data.result);
    return data.result || [];
  },

  async getBrandById(id: number): Promise<VehicleBrand> {
    const data = await axiosPublic.get<any, ApiResponse<VehicleBrand>>(
      `/brand/${id}`,
    );
    console.log("Fetched brand:", data.result);
    if (!data.result) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Hãng xe không tồn tại",
          },
        },
      };
    }
    return data.result;
  },
};
