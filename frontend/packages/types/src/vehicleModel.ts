export interface VehicleModel {
  id: number;
  brandId: number;
  name: string;
  engineCapacity: number;
  yearFrom?: number;
  yearTo?: number;
  createdAt: string;
}

export interface VehicleModelCreationRequest {
  brandId: number;
  name: string;
  engineCapacity: number;
  yearFrom?: number;
  yearTo?: number;
}

export interface VehicleModelUpdateRequest {
  brandId: number;
  name: string;
  engineCapacity: number;
  yearFrom?: number;
  yearTo?: number;
}
