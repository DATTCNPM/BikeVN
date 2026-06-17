// src/apis/bookingApi.ts

import axiosAdmin from "../axios/axiosAdmin";

import type { Booking, PaginationResponse } from "@repo/types";

import { createBookingCommonApi } from "../common/createBookingCommonApi";

export const bookingAdminApi = {
  ...createBookingCommonApi(axiosAdmin),
  async getAllBooking(page: number, size: number) {
    const data = await axiosAdmin.get<
      PaginationResponse<Booking>,
      PaginationResponse<Booking>
    >(`/bookings?page=${page}&size=${size}`);
    return data;
  },
  async approveBooking(id: string) {
    await axiosAdmin.post(`/bookings/${id}/approve`);
  },
  async rejectBooking(id: string) {
    await axiosAdmin.post(`/bookings/${id}/reject`);
  },
};
