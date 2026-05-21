export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cccdNumber?: string;
  cccd_number?: string;
  role?: "user" | "admin";
  created_at?: string;
  updated_at?: string;
}

