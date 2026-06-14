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
    return axiosPublic.post<LoginPayload, AuthenticationResponse>(
      "/auth/login",
      payload,
    );
  },

  async register(payload: RegisterPayload): Promise<AuthenticationResponse> {
    return axiosPublic.post<RegisterPayload, AuthenticationResponse>(
      "/users",
      payload,
    );
  },

  async introspect(token: string): Promise<IntrospectResponse> {
    return axiosPublic.post<any, IntrospectResponse>("/auth/introspect", {
      token,
    });
  },
};
