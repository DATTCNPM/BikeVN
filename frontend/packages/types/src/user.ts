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
