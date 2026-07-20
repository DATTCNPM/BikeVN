import axiosClient from "@/hooks/axiosClient";

import type { Booking, BookingCreationPayload } from "@repo/schemas";

import {
  createBookingCommonApi,
  createVehicleReturnCommonApi,
} from "@repo/api";

export const bookingClientApi = {
  ...createBookingCommonApi(axiosClient),
  ...createVehicleReturnCommonApi(axiosClient),
  async createBooking(payload: BookingCreationPayload) {
    console.log("Creating booking with payload:", payload);
    const idempotencyKey = crypto.randomUUID();

    return axiosClient.post<Booking, Booking, BookingCreationPayload>(
      "/bookings",
      payload,
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      },
    );
  },

  async getBookingsByUser(userId: string) {
    const data = await axiosClient.get<Booking[], Booking[]>(
      `/bookings/user/${userId}`,
    );

    return data;
  },

  async cancelBooking(bookingId: string) {
    await axiosClient.post(`/bookings/${bookingId}/cancel`);
  },
};
