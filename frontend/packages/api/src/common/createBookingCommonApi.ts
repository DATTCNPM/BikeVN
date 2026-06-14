import type { AxiosInstance } from "axios";
import type { Booking } from "@repo/types";

export const createBookingCommonApi = (axiosInstance: AxiosInstance) => ({
  async getBooking(id: string) {
    const data = await axiosInstance.get<Booking, Booking>(`/bookings/${id}`);

    if (!data) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Booking không tồn tại",
          },
        },
      };
    }

    return data;
  },
});
