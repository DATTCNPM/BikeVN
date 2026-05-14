// src/apis/authApi.ts

import type { MockData } from "@/data/UserData";
import { users } from "@/data/UserData";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  async login(payload: LoginPayload) {
    await delay(500);

    const user = users.find(
      (u) => u.email === payload.email && u.password === payload.password,
    );

    if (!user) {
      throw {
        response: {
          status: 401,
          data: {
            message: "Sai email hoặc mật khẩu",
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

    return users[0];
  },

  async logout() {
    await delay(300);

    return { status: 200, message: "Đăng xuất thành công" };
  },
};
