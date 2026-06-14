// src/apis/bookingApi.ts

import axiosAdmin from "../axios/axiosAdmin";

import type { Booking, PaginationResponse } from "@repo/types";

import { createBookingCommonApi } from "../common/createBookingCommonApi";

export const bookingAdminApi = {
  ...createBookingCommonApi(axiosAdmin),
  async getAllBooking() {
    const data = await axiosAdmin.get<
      PaginationResponse<Booking>,
      PaginationResponse<Booking>
    >("/bookings");
    return data;
  },
  async approveBooking(id: string) {
    await axiosAdmin.post(`/bookings/${id}/approve`);
  },
  async rejectBooking(id: string) {
    await axiosAdmin.post(`/bookings/${id}/reject`);
  },
};
