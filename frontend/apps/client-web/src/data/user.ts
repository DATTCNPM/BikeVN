export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  cccd_number: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}

export const user: User = {
  id: "123456",
  email: "user1@example.com",
  name: "Nguyễn Văn A",
  phone: "0123456789",
  cccd_number: "123456789012",
  role: "user",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
};
