import axiosPublic from "../axios/axiosPublic";
import type {
  AuthenticationResponse,
  IntrospectResponse,
  LoginPayload,
  RegisterPayload,
} from "@repo/types";

export const authApi = {
  async ping() {
    // Truyền thêm flag ẩn dưới dạng AxiosRequestConfig

    const response = await axiosPublic.get("/auth/test", {
      skipAuthCheck: true,
    } as any);
    return response;
  },

  async login(payload: LoginPayload): Promise<AuthenticationResponse> {
    return axiosPublic.post<AuthenticationResponse>("/auth/login", payload);
  },

  async register(payload: RegisterPayload): Promise<AuthenticationResponse> {
    return axiosPublic.post<AuthenticationResponse>("/users", payload);
  },

  async introspect(token: string): Promise<IntrospectResponse> {
    return axiosPublic.post<IntrospectResponse>("/auth/introspect", {
      token,
    });
  },
};
