export type Review = {
  id: string;
  booking_id: string;
  user_id: string;
  vehicle_id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
  updated_at: string;
  user: {
    email: string;
    name: string;
  };
};
