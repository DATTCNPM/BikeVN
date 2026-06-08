import axiosClient from "../axios/axiosClient";

import type { Booking, BookingCreationPayload } from "@repo/types";

export const bookingClientApi = {
  async createBooking(payload: BookingCreationPayload) {
    const idempotencyKey = crypto.randomUUID();

    return axiosClient.post<Booking, Booking, BookingCreationPayload>(
      "/booking",
      payload,
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      },
    );
  },

  async cancelBooking(bookingId: string) {
    await axiosClient.post(`/booking/${bookingId}/cancel`);
  },
};
