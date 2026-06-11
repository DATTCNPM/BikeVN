import axiosPublic from "../axios/axiosPublic";
import type { VehicleBrand } from "@repo/types";

export const vehicleBrandPublicApi = {
  async getBrands() {
    const data = await axiosPublic.get<VehicleBrand[], VehicleBrand[]>(
      "/brand",
    );
    return data;
  },

  async getBrandById(id: number) {
    const data = await axiosPublic.get<VehicleBrand, VehicleBrand>(
      `/brand/${id}`,
    );
   
    return data;
  },
};
