export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  cccd_number: string;
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

export type Vehicle = {
  id: string;
  name: string;
  vehicle_type: string;
  price: number;
  image: string;
  status: "available" | "rented" | "maintenance";
  current_branch_id: string;
  created_at: string;
  updated_at: string;
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: "active" | "inactive";
  created_at: string;
};

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
