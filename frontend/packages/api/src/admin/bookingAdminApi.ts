// src/apis/bookingApi.ts

import axiosAdmin from "../axios/axiosAdmin";

import type { Booking } from "@repo/types";

import { createBookingCommonApi } from "../common/createBookingCommonApi";

export const bookingAdminApi = {
  ...createBookingCommonApi(axiosAdmin),
  async getAllBooking() {
    const data = await axiosAdmin.get<Booking[]>("/booking");
    return data || [];
  },
  async approveBooking(id: string) {
    await axiosAdmin.post(`/booking/${id}/approve`);
  },
  async rejectBooking(id: string) {
    await axiosAdmin.post(`/booking/${id}/reject`);
  },
};
