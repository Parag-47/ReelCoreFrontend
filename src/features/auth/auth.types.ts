import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
  PublicKeyCredentialCreationOptionsJSON,
} from '@simplewebauthn/browser';

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

export type PasskeyOptionsResponse = PublicKeyCredentialRequestOptionsJSON;

export type PasskeyRegistrationOptionsResponse =
  PublicKeyCredentialCreationOptionsJSON;

export type PasskeyVerifyRequest = {
  credential: AuthenticationResponseJSON | RegistrationResponseJSON;
};

export interface BackendApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
