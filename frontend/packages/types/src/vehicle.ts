import { VehicleImage } from "./vehicleImage";
export type StatusVehicleEnum = "available" | "unavailable" | "maintenance";

export type VehicleType = "fuel" | "electric";

export interface Vehicle {
  id: string;
  name: string;
  brandId: number;
  modelId: number;
  licensePlate: string;
  color: string;
  year: number;
  pricePerDay: number;
  vehicleType: VehicleType;
  mileage: number;
  description?: string;
  status: StatusVehicleEnum;
  currentBranchId: string;
  images: VehicleImage[];
  createdAt: string;
  updatedAt: string;
}

export interface VehicleCreationRequest {
  name: string;
  brandId: number;
  modelId: number;
  licensePlate: string;
  color: string;
  year: number;
  pricePerDay: number;
  vehicleType: VehicleType;
  mileage: number;
  description?: string;
  status: StatusVehicleEnum;
  images: VehicleImage[];
  currentBranchId: string;
}

export interface VehicleQueryParams {
  search?: string;
  branchId?: string;
  vehicleType?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export type VehicleUpdateRequest = Partial<VehicleCreationRequest>;
