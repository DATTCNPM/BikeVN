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
  imageUrl: string[];
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
  imageUrl: string[];
  currentBranchId: string;
}

export type VehicleUpdateRequest = Partial<VehicleCreationRequest>;
