export interface ApiResponse<T> {
  code: number;
  message?: string;
  result?: T;
}

export interface AuthenticationResponse {
  token: string;
  refreshToken: string;
  authenticated: boolean;
}

export interface IntrospectResponse {
  valid: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}
