import { env } from '@/config/env';
import type { ApiErrorResponse } from '@/types/api';

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const init: RequestInit = {
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...rest,
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, init);
  } catch {
    throw new ApiError(
      'Unable to reach the server. Check your connection and try again.',
      0,
    );
  }

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const errorBody = payload as ApiErrorResponse | null;
    const message =
      errorBody?.message ??
      defaultErrorMessage(response.status);
    throw new ApiError(
      message,
      response.status,
      errorBody?.code,
      errorBody?.details,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (isJson) {
    return payload as T;
  }

  return undefined as T;
}

function defaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'The request was invalid. Please check your input and try again.';
    case 401:
      return 'Invalid email or password.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 409:
      return 'An account with this email already exists.';
    case 422:
      return 'The submitted data was invalid. Please review and try again.';
    case 429:
      return 'Too many attempts. Please wait a moment and try again.';
    case 500:
      return 'Something went wrong on our end. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
