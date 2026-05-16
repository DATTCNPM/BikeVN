// src/apis/bookingApi.ts

import { bookings } from "./data/BookingData";

import type { Booking } from "@repo/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type CreateBookingPayload = {
  user_id: string;

  vehicle_id: string;

  pickup_branch_id: string;

  return_branch_id: string;

  start_date: string;

  end_date: string;

  total_price: number;

  status?: Booking["status"];
};

export type UpdateBookingPayload = Partial<CreateBookingPayload> & {
  actual_return_date?: string | null;
};

export const bookingApi = {
  async getBookings() {
    await delay(500);

    return bookings;
  },

  async getBookingById(id: string) {
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

  async createBooking(payload: CreateBookingPayload) {
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

  async updateBooking(id: string, payload: UpdateBookingPayload) {
    await delay(500);

    const bookingIndex = bookings.findIndex((b) => b.id === id);

    if (bookingIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Đơn đặt xe không tồn tại",
          },
        },
      };
    }

    bookings[bookingIndex] = {
      ...bookings[bookingIndex],

      ...payload,

      updated_at: new Date().toISOString(),
    };

    return {
      message: "Cập nhật đơn đặt xe thành công",

      booking: bookings[bookingIndex],
    };
  },

  async deleteBooking(id: string) {
    await delay(500);

    const bookingIndex = bookings.findIndex((b) => b.id === id);

    if (bookingIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Đơn đặt xe không tồn tại",
          },
        },
      };
    }

    bookings.splice(bookingIndex, 1);

    return {
      message: "Xóa đơn đặt xe thành công",
    };
  },
};
