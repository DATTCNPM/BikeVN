import axiosClient from "../axios/axiosClient";

import type { ApiResponse, Booking, BookingCreationPayload } from "@repo/types";

export const bookingClientApi = {
  async createBooking(payload: BookingCreationPayload): Promise<Booking> {
    const data = await axiosClient.post<any, ApiResponse<Booking>>(
      "/booking",
      payload,
    );

    return data.result!;
  },

  async cancelBooking(bookingId: string): Promise<{ message: string }> {
    await axiosClient.post(`/booking/${bookingId}/cancel`);

    return {
      message: "Hủy booking thành công",
    };
  },
};
