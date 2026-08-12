// src/apis/bookingApi.ts
import { axiosAdmin } from "@/hooks/axiosAdmin";
import type { Booking, BookingFilter } from "@repo/schemas";
import type { PaginationResponse } from "@repo/types";
import { createBookingCommonApi } from "@repo/api";

export const bookingAdminApi = {
  ...createBookingCommonApi(axiosAdmin),

  // API lấy toàn bộ booking hệ thống (Dành cho Admin)
  async getAllBooking(page: number, size: number) {
    const data = await axiosAdmin.get<
      PaginationResponse<Booking>,
      PaginationResponse<Booking>
    >(`/bookings?page=${page}&size=${size}`);
    return data;
  },

  // API lấy booking của riêng chi nhánh (Dành cho Employee) - MỚI
  async getAllBookingByBranch(page: number, size: number) {
    const data = await axiosAdmin.get<
      PaginationResponse<Booking>,
      PaginationResponse<Booking>
    >(`/bookings/branch?page=${page}&size=${size}`);
    return data;
  },

  async rejectBooking(id: string) {
    await axiosAdmin.post(`/bookings/${id}/reject`);
  },

  async getBookingFilters(params?: BookingFilter) {
    const data = await axiosAdmin.get<
      PaginationResponse<Booking>,
      PaginationResponse<Booking>
    >("/bookings/admin/filter", {
      params,
    });
    return data;
  },

  async searchBookingsByPhone(phone: string) {
    const data = await axiosAdmin.get<Booking[], Booking[]>(
      "/bookings/search",
      {
        params: { phone },
      },
    );
    return data;
  },
};
