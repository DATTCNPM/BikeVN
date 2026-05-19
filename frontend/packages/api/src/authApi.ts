// src/apis/authApi.ts

import { users } from "./data/UserData";
import { type MockData } from "./data/UserData";

import type { User } from "@repo/types";
import type {
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  UpdatePasswordPayload,
} from "@repo/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  async ping() {
    return { message: "pong" };
  },
  async login(
    payload: LoginPayload,
  ): Promise<{ message: string; user: User; access_token: string }> {
    await delay(1000);

    const user = users.find((u) => u.email === payload.email);

    if (!user || user.password !== payload.password) {
      throw {
        response: {
          data: {
            message: "Tài khoản hoặc mật khẩu không chính xác",
          },
        },
      };
    }

    const { password, ...userWithoutPassword } = user;

    return {
      access_token: "mock_token",
      user: userWithoutPassword,
    };
  },

  async register(payload: RegisterPayload) {
    await delay(500);

    if (payload.password !== payload.confirmPassword) {
      throw {
        response: {
          status: 400,
          data: {
            message: "Mật khẩu và xác nhận mật khẩu không khớp",
          },
        },
      };
    }

    const existedUser = users.find((u) => u.email === payload.email);

    if (existedUser) {
      throw {
        response: {
          status: 400,
          data: {
            message: "Email đã tồn tại",
          },
        },
      };
    }

    const newUser: MockData = {
      id: crypto.randomUUID(),
      email: payload.email,
      password: payload.password,
      name: payload.name,
      role: "user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    users.push(newUser);

    const { password, ...userWithoutPassword } = newUser;

    return {
      message: "Đăng ký thành công",
      user: userWithoutPassword,
    };
  },

  async getProfile() {
    await delay(500);

    if (localStorage.getItem("admin_token")) {
      const admin = users.find((u) => u.role === "admin");
      if (admin) {
        const { password, ...adminWithoutPassword } = admin;
        return adminWithoutPassword;
      }
    }

    const user = users.find((u) => u.role === "user");
    const { password, ...userWithoutPassword } = user!;
    return userWithoutPassword;
  },

  async logout() {
    await delay(300);

    return { status: 200, message: "Đăng xuất thành công" };
  },

  async updateProfile(userId: string, payload: UpdateProfilePayload) {
    await delay(500);

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Người dùng không tồn tại",
          },
        },
      };
    }

    users[userIndex] = {
      ...users[userIndex],
      name: payload.name,
      phone: payload.phone ? payload.phone : users[userIndex].phone,
      cccd_number: payload.cccd_number
        ? payload.cccd_number
        : users[userIndex].cccd_number,
      updated_at: new Date().toISOString(),
    };

    const { password, ...userWithoutPassword } = users[userIndex];

    return {
      message: "Cập nhật thông tin thành công",
      user: userWithoutPassword as User,
    };
  },
};
