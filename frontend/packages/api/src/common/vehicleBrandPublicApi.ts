import axiosPublic from "../axios/axiosPublic";
import type { VehicleBrand } from "@repo/types";

export const vehicleBrandPublicApi = {
  async getBrands() {
    const data = await axiosPublic.get<VehicleBrand[], VehicleBrand[]>(
      "/brand",
    );
    console.log("Fetched brands:", data);
    return data || [];
  },

  async getBrandById(id: number) {
    const data = await axiosPublic.get<VehicleBrand, VehicleBrand>(
      `/brand/${id}`,
    );
    console.log("Fetched brand:", data);
    if (!data) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Hãng xe không tồn tại",
          },
        },
      };
    }
    return data;
  },
};
