export type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  cccd_number?: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: number;
  booking_id: number;
  user_id: number;
  vehicle_id: number;
  rating: number;
  comment?: string | null;
  created_at: string;

  user: {
    name: string;
    avatar: string;
  };
};

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

export type BranchStatus = "active" | "inactive";

export interface Branch {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: BranchStatus;
  created_at: string;
}

export type Booking = {
  id: string;
  user_id: string;
  vehicle_id: string;
  pickup_branch_id: string;
  return_branch_id: string;
  start_date: string;
  end_date: string;
  actual_return_date?: string | null;
  total_price: number;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
};

export type PaymentMethod = {
  id: string;
  booking_id: string;
  amount: number;
  type: "deposit" | "rental";
  card_method: "momo" | "vnpay" | "card";
  payment_method: string;
  status: "pending" | "completed" | "failed" | "refunded";
  transaction_code?: string | null;
  paid_at?: string | null;
  created_at: string;
};
