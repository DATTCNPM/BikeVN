import axiosClient from "../axios/axiosClient";
import type {  Booking } from "@repo/types";

export const bookingApi = {
  async getBooking(id: string){
    const data = await axiosClient.get<Booking>(
      `/booking/${id}`,
    );

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

  async getBookingsByUser(userId: string) {
    const data = await axiosClient.get<Booking[]>(
      `/booking/user/${userId}`,
    );

    return data || [];
  },
};
