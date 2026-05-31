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

export type CreateBookingPayload = {
  user_id: string;

  vehicle_id: string;

  pickup_branch_id: string;

  return_branch_id: string;

  start_date: string;

  end_date: string;

  total_price: number;

  status?: Booking["status"];
};

export type UpdateBookingPayload = Partial<CreateBookingPayload> & {
  actual_return_date?: string | null;
};
