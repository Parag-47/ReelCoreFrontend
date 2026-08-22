export interface User {
  id: string;
  email: string;
  username?: string;
  isVerified?: boolean;
  authProvider?: AuthProvider;
}

export type AuthProvider = "email" | "google" | "passkey";

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

export interface PasskeyVerifyRequest {
  credential: unknown;
}
