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
    return axiosPublic.get("/auth/test", {
      skipAuthCheck: true,
    } as any);
  },

  async login(payload: LoginPayload): Promise<AuthenticationResponse> {
    return axiosPublic.post<LoginPayload, AuthenticationResponse>(
      "/auth/login",
      payload,
    );
  },

  async register(payload: RegisterPayload): Promise<AuthenticationResponse> {
    return axiosPublic.post<RegisterPayload, AuthenticationResponse>(
      "/user",
      payload,
    );
  },

  async introspect(token: string): Promise<IntrospectResponse> {
    return axiosPublic.post<any, IntrospectResponse>("/auth/introspect", {
      token,
    });
  },
};
