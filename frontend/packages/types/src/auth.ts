export interface ApiResponse<T> {
  code: number;
  message?: string;
  result?: T;
}

export interface AuthenticationResponse {
  token: string;
  authenticated: boolean;
}

export interface IntrospectResponse {
  valid: boolean;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface UserCreationRequest {
  name: string;
  email?: string;
  passwordHash: string;
  phone?: string;
  cccdNumber?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  cccdNumber?: string;
}

export interface UpdatePasswordPayload {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
