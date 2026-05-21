import axiosClient from "./axious";
import type {
  ApiResponse,
  AuthenticationResponse,
  IntrospectResponse,
  LoginPayload,
  UserCreationRequest,
  User,
} from "@repo/types";

export const authApi = {
  async ping() {
    // Truyền thêm flag ẩn dưới dạng AxiosRequestConfig
    return axiosClient.get("/auth/test", {
      skipAuthCheck: true,
    } as any);
  },

  async login(
    payload: LoginPayload,
  ): Promise<ApiResponse<AuthenticationResponse>> {
    return axiosClient.post("/auth/login", payload);
  },

  async register(payload: UserCreationRequest): Promise<ApiResponse<User>> {
    return axiosClient.post("/user", payload);
  },

  async getProfile(): Promise<ApiResponse<User>> {
    return axiosClient.get("/user");
  },

  async logout(token: string): Promise<ApiResponse<void>> {
    return axiosClient.post("/auth/logout", { token });
  },

  async introspect(token: string): Promise<ApiResponse<IntrospectResponse>> {
    return axiosClient.post("/auth/introspect", { token });
  },
};
