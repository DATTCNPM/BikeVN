// src/store/useVehicleStore.ts

import { create } from "zustand";

import { devtools } from "zustand/middleware";

import {
  vehicleApi,
  type CreateVehiclePayload,
  type UpdateVehiclePayload,
} from "@/api/vehicleApi";

import type { Vehicle } from "@/lib/types";

interface VehicleState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
  // Actions
  fetchVehicles: () => Promise<void>;
  fetchVehicleById: (id: string) => Promise<void>;
  createVehicle: (payload: CreateVehiclePayload) => Promise<boolean>;
  updateVehicle: (
    id: string,
    payload: UpdateVehiclePayload,
  ) => Promise<boolean>;
  deleteVehicle: (id: string) => Promise<boolean>;
  clearSelectedVehicle: () => void;
  setError: (message: string | null) => void;
}

export const useVehicleStore = create<VehicleState>()(
  devtools(
    (set) => ({
      // State
      vehicles: [],
      selectedVehicle: null,
      loading: false,
      error: null,
      // Actions
      fetchVehicles: async () => {
        set({
          loading: true,
          error: null,
        });

        try {
          const data = await vehicleApi.getVehicles();

          set({
            vehicles: data,
          });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Lấy danh sách xe thất bại",
          });
        } finally {
          set({
            loading: false,
          });
        }
      },

      fetchVehicleById: async (id) => {
        set({
          loading: true,
          error: null,
        });

        try {
          const vehicle = await vehicleApi.getVehicleById(id);

          set({
            selectedVehicle: vehicle,
          });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Không tìm thấy xe",
          });
        } finally {
          set({
            loading: false,
          });
        }
      },

      createVehicle: async (payload) => {
        set({
          loading: true,
          error: null,
        });

        try {
          const response = await vehicleApi.createVehicle(payload);

          set((state) => ({
            vehicles: [...state.vehicles, response.vehicle],
          }));

          return true;
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Thêm xe thất bại",
          });

          return false;
        } finally {
          set({
            loading: false,
          });
        }
      },

      updateVehicle: async (id, payload) => {
        set({
          loading: true,
          error: null,
        });

        try {
          const response = await vehicleApi.updateVehicle(id, payload);

          set((state) => ({
            vehicles: state.vehicles.map((vehicle) =>
              vehicle.id === id ? response.vehicle : vehicle,
            ),

            selectedVehicle: response.vehicle,
          }));

          return true;
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Cập nhật xe thất bại",
          });

          return false;
        } finally {
          set({
            loading: false,
          });
        }
      },

      deleteVehicle: async (id) => {
        set({
          loading: true,
          error: null,
        });

        try {
          await vehicleApi.deleteVehicle(id);

          set((state) => ({
            vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
          }));

          return true;
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Xóa xe thất bại",
          });

          return false;
        } finally {
          set({
            loading: false,
          });
        }
      },

      clearSelectedVehicle: () => {
        set({
          selectedVehicle: null,
        });
      },

      setError: (message) => {
        set({
          error: message,
        });
      },
    }),
    {
      name: "vehicle-store",
    },
  ),
);
