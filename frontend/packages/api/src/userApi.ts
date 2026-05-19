import { users } from "./data/UserData";
import type { User } from "@repo/types";

export type CreateUserPayload = {
  name: string;
  email: string;
  phone?: string;
  cccd_number?: string;
  role: "user" | "admin";
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const userApi = {
  async getUsers(): Promise<User[]> {
    await delay(500);
    return users.map(({ password, ...user }) => user as User);
  },

  async getUserById(id: string): Promise<User> {
    await delay(300);
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw { response: { status: 404, data: { message: "Người dùng không tồn tại" } } };
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },

  async createUser(payload: CreateUserPayload): Promise<{ message: string; user: User }> {
    await delay(500);
    const newUser = {
      id: Date.now().toString(),
      ...payload,
      password: "defaultPassword123",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return { message: "Thêm người dùng thành công", user: userWithoutPassword as User };
  },

  async updateUser(id: string, payload: Partial<CreateUserPayload>): Promise<{ message: string; user: User }> {
    await delay(500);
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw { response: { status: 404, data: { message: "Người dùng không tồn tại" } } };
    }
    users[userIndex] = {
      ...users[userIndex],
      ...payload,
      updated_at: new Date().toISOString(),
    };
    const { password, ...userWithoutPassword } = users[userIndex];
    return { message: "Cập nhật người dùng thành công", user: userWithoutPassword as User };
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    await delay(500);
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw { response: { status: 404, data: { message: "Người dùng không tồn tại" } } };
    }
    users.splice(userIndex, 1);
    return { message: "Xóa người dùng thành công" };
  },
};
