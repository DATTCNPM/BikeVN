// src/store/useBookingStore.ts

import { create } from "zustand";

import { devtools } from "zustand/middleware";

import {
  bookingApi,
  type CreateBookingPayload,
  type UpdateBookingPayload,
} from "@/api/bookingApi";

import type { Booking } from "@/lib/types";

interface BookingState {
  bookings: Booking[];

  selectedBooking: Booking | null;

  loading: boolean;

  error: string | null;

  // Actions

  fetchBookings: () => Promise<void>;

  fetchBookingById: (id: string) => Promise<void>;

  createBooking: (payload: CreateBookingPayload) => Promise<boolean>;

  updateBooking: (
    id: string,
    payload: UpdateBookingPayload,
  ) => Promise<boolean>;

  deleteBooking: (id: string) => Promise<boolean>;

  clearSelectedBooking: () => void;

  setError: (message: string | null) => void;
}

export const useBookingStore = create<BookingState>()(
  devtools(
    (set) => ({
      // State

      bookings: [],

      selectedBooking: null,

      loading: false,

      error: null,

      // Actions

      fetchBookings: async () => {
        set({
          loading: true,
          error: null,
        });

        try {
          const data = await bookingApi.getBookings();

          set({
            bookings: data,
          });
        } catch (err: any) {
          set({
            error:
              err.response?.data?.message ||
              "Lấy danh sách đơn đặt xe thất bại",
          });
        } finally {
          set({
            loading: false,
          });
        }
      },

      fetchBookingById: async (id) => {
        set({
          loading: true,
          error: null,
        });

        try {
          const booking = await bookingApi.getBookingById(id);

          set({
            selectedBooking: booking,
          });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Không tìm thấy đơn đặt xe",
          });
        } finally {
          set({
            loading: false,
          });
        }
      },

      createBooking: async (payload) => {
        set({
          loading: true,
          error: null,
        });

        try {
          const response = await bookingApi.createBooking(payload);

          set((state) => ({
            bookings: [...state.bookings, response.booking],
          }));

          return true;
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Tạo đơn đặt xe thất bại",
          });

          return false;
        } finally {
          set({
            loading: false,
          });
        }
      },

      updateBooking: async (id, payload) => {
        set({
          loading: true,
          error: null,
        });

        try {
          const response = await bookingApi.updateBooking(id, payload);

          set((state) => ({
            bookings: state.bookings.map((booking) =>
              booking.id === id ? response.booking : booking,
            ),

            selectedBooking: response.booking,
          }));

          return true;
        } catch (err: any) {
          set({
            error:
              err.response?.data?.message || "Cập nhật đơn đặt xe thất bại",
          });

          return false;
        } finally {
          set({
            loading: false,
          });
        }
      },

      deleteBooking: async (id) => {
        set({
          loading: true,
          error: null,
        });

        try {
          await bookingApi.deleteBooking(id);

          set((state) => ({
            bookings: state.bookings.filter((booking) => booking.id !== id),
          }));

          return true;
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Xóa đơn đặt xe thất bại",
          });

          return false;
        } finally {
          set({
            loading: false,
          });
        }
      },

      clearSelectedBooking: () => {
        set({
          selectedBooking: null,
        });
      },

      setError: (message) => {
        set({
          error: message,
        });
      },
    }),
    {
      name: "booking-store",
    },
  ),
);
