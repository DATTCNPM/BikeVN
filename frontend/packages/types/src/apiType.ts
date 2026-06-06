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
