// src/apis/vehicleApi.ts

import { vehicles } from "@/data/VehicleData";

import type { FuelType, Vehicle, VehicleStatus } from "@/lib/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type CreateVehiclePayload = {
  name: string;
  brand: string;
  model: string;
  license_plate: string;
  color: string;
  year: number;
  price_per_day: number;
  status?: VehicleStatus;
  engine_capacity: number;
  fuel_type: FuelType;
  mileage: number;
  image_url: string[];
  description?: string;
  current_branch_id: string;
};

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;

export const vehicleApi = {
  async getVehicles() {
    await delay(500);

    return vehicles;
  },

  async getVehicleById(id: string) {
    await delay(300);

    const vehicle = vehicles.find((v) => v.id === id);

    if (!vehicle) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Xe không tồn tại",
          },
        },
      };
    }

    return vehicle;
  },

  async createVehicle(payload: CreateVehiclePayload) {
    await delay(500);

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      name: payload.name,
      brand: payload.brand,
      model: payload.model,
      license_plate: payload.license_plate,
      color: payload.color,
      year: payload.year,
      price_per_day: payload.price_per_day,
      status: payload.status || "available",
      engine_capacity: payload.engine_capacity,
      fuel_type: payload.fuel_type,
      mileage: payload.mileage,
      image_url: payload.image_url,
      description: payload.description,
      current_branch_id: payload.current_branch_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    vehicles.push(newVehicle);

    return {
      message: "Thêm xe thành công",

      vehicle: newVehicle,
    };
  },

  async updateVehicle(id: string, payload: UpdateVehiclePayload) {
    await delay(500);

    const vehicleIndex = vehicles.findIndex((v) => v.id === id);

    if (vehicleIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Xe không tồn tại",
          },
        },
      };
    }

    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],

      ...payload,

      updated_at: new Date().toISOString(),
    };

    return {
      message: "Cập nhật xe thành công",

      vehicle: vehicles[vehicleIndex],
    };
  },

  async deleteVehicle(id: string) {
    await delay(500);

    const vehicleIndex = vehicles.findIndex((v) => v.id === id);

    if (vehicleIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Xe không tồn tại",
          },
        },
      };
    }

    vehicles.splice(vehicleIndex, 1);

    return {
      message: "Xóa xe thành công",
    };
  },
};
