// src/apis/bookingApi.ts

import axiosAdmin from "../axios/axiosAdmin";

import type {
  ApiResponse,
  Booking,
  BookingCreationPayload,
  UpdateBookingPayload,
} from "@repo/types";

export const bookingAdminApi = {
  async getAllBooking(): Promise<Booking[]> {
    const data = await axiosAdmin.get<any, ApiResponse<Booking[]>>("/booking");
    return data.result || [];
  },

  async createBooking(payload: BookingCreationPayload): Promise<Booking> {
    const idempotencyKey = crypto.randomUUID();
    const data = await axiosAdmin.post<any, ApiResponse<Booking>>(
      "/booking",
      payload,
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      },
    );

    return data.result!;
  },

  async updateBooking(
    id: string,
    payload: UpdateBookingPayload,
  ): Promise<{ message: string }> {
    const data = await axiosAdmin.put<any, ApiResponse<Booking>>(
      `/booking/${id}`,
      payload,
    );

    if (!data.result) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Đơn đặt xe không tồn tại",
          },
        },
      };
    }

    return { message: "Cập nhật đơn đặt xe thành công" };
  },

  async deleteBooking(id: string): Promise<{ message: string }> {
    const data = await axiosAdmin.delete<any, ApiResponse<null>>(
      `/booking/${id}`,
    );

    if (!data.result) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Đơn đặt xe không tồn tại",
          },
        },
      };
    }

    return {
      message: "Xóa đơn đặt xe thành công",
    };
  },
};
