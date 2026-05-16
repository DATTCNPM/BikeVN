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
