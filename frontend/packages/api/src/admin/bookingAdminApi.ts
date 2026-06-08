// src/apis/bookingApi.ts

import axiosAdmin from "../axios/axiosAdmin";

import type { Booking } from "@repo/types";

export const bookingAdminApi = {
  async getAllBooking(){
    const data = await axiosAdmin.get<Booking[]>("/booking");
    return data || [];
  },
};
