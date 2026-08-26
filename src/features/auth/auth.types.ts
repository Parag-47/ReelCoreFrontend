export interface User {
  id: string;
  email: string;
  username: string | null;
  emailVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  authProvider?: AuthProvider;
}

export type AuthProvider = 'email' | 'google' | 'passkey';

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface AuthResult {
  user: User;
}

export interface PasskeyOptionsResponse {
  challenge: string;
  rpId?: string;
  allowCredentials?: Array<{ id: string; type: string }>;
  userVerification?: string;
  timeout?: number;
}

export interface PasskeyRegistrationOptionsResponse {
  challenge: string;
  rp?: { name: string; id?: string };
  user?: {
    id: string;
    name?: string;
    displayName?: string;
  };
  pubKeyCredParams?: Array<{ type: string; alg: number }>;
  timeout?: number;
  excludeCredentials?: Array<{ id: string; type: string }>;
  authenticatorSelection?: Record<string, unknown>;
  attestation?: string;
}

export interface PasskeyVerifyRequest {
  credential: unknown;
}

export interface BackendApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
