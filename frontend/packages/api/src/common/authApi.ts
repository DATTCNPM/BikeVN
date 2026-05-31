import axiosPublic from "../axios/axiosPublic";
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
    return axiosPublic.get("/auth/test", {
      skipAuthCheck: true,
    } as any);
  },

  async login(
    payload: LoginPayload,
  ): Promise<ApiResponse<AuthenticationResponse>> {
    return axiosPublic.post("/auth/login", payload);
  },

  async register(payload: UserCreationRequest): Promise<ApiResponse<User>> {
    return axiosPublic.post("/user", payload);
  },

  async introspect(token: string): Promise<ApiResponse<IntrospectResponse>> {
    return axiosPublic.post("/auth/introspect", { token });
  },
};
