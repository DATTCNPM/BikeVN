import axiosClient from "../axios/axiosClient";
import type { ApiResponse, Booking } from "@repo/types";

export const bookingApi = {
  async getBooking(id: string): Promise<Booking> {
    const data = await axiosClient.get<any, ApiResponse<Booking>>(
      `/booking/${id}`,
    );

    if (!data.result) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Booking không tồn tại",
          },
        },
      };
    }

    return data.result;
  },

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    const data = await axiosClient.get<any, ApiResponse<Booking[]>>(
      `/booking/user/${userId}`,
    );

    return data.result || [];
  },
};
