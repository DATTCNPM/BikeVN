export type VehicleStatus = "available" | "unavailable" | "maintenance";

export type FuelType = "gasoline" | "diesel" | "electric" | "hybrid";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  license_plate: string;
  color: string;
  year: number;
  price_per_day: number;
  status: VehicleStatus;
  engine_capacity: number;
  fuel_type: FuelType;
  mileage: number;
  image_url: string[];
  description?: string;
  current_branch_id: string;
  created_at: string;
  updated_at: string;
}
