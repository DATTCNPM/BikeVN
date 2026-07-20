import type { AxiosInstance } from "axios";
import type { VehicleReturn } from "@repo/schemas";

export const createVehicleReturnCommonApi = (axiosInstance: AxiosInstance) => ({
  async getVehicleReturn(bookingId: string): Promise<VehicleReturn> {
    return axiosInstance.get<VehicleReturn, VehicleReturn>(
      `/bookings/returns/booking/${bookingId}`,
    );
  },
});
