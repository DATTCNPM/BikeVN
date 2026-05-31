export interface VehicleBrand {
  id: number;
  name: string;
  country: string;
  createdAt: string;
}

export interface VehicleBrandCreationRequest {
  name: string;
  country: string;
}

export interface VehicleBrandUpdateRequest {
  name: string;
  country: string;
}
