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

export interface PaginationResponse<T> {
  data: T[];
  pageCurrent: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}
