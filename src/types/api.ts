export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
