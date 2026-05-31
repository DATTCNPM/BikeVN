// src/apis/bookingApi.ts

import { bookings } from "../data/BookingData";

import type { Booking, CreateBookingPayload } from "@repo/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const bookingApi = {
  async getMyBookings(): Promise<Booking[]> {
    await delay(500);

    return bookings;
  },

  async getBookingById(id: string): Promise<Booking> {
    await delay(300);

    const booking = bookings.find((b) => b.id === id);

    if (!booking) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Đơn đặt xe không tồn tại",
          },
        },
      };
    }

    return booking;
  },

  async createBooking(
    payload: CreateBookingPayload,
  ): Promise<{ message: string; booking: Booking }> {
    await delay(500);

    const newBooking: Booking = {
      id: crypto.randomUUID(),

      user_id: payload.user_id,

      vehicle_id: payload.vehicle_id,

      pickup_branch_id: payload.pickup_branch_id,

      return_branch_id: payload.return_branch_id,

      start_date: payload.start_date,

      end_date: payload.end_date,

      actual_return_date: null,

      total_price: payload.total_price,

      status: payload.status || "pending",

      created_at: new Date().toISOString(),

      updated_at: new Date().toISOString(),
    };

    bookings.push(newBooking);

    return {
      message: "Tạo đơn đặt xe thành công",

      booking: newBooking,
    };
  },
};
