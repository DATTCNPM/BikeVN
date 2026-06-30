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
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface ChatResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}
