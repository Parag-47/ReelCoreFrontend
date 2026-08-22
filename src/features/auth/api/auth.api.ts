import { apiClient, ApiError } from '@/lib/api-client';
import type {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  PasskeyOptionsResponse,
  PasskeyVerifyRequest,
  User,
} from '../auth.types';
import { env } from '@/config/env';

// --- Backend response shapes (kept private to this adapter) ---

interface BackendUser {
  id?: string;
  _id?: string;
  email?: string;
  username?: string | null;
  emailVerified?: boolean;
  verified?: boolean;
  isVerified?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
  authProvider?: string;
  provider?: string;
}

interface BackendAuthResponse {
  user?: BackendUser;
  data?: BackendUser;
  message?: string;
}

// --- Mapping helpers ---

function mapUser(raw: BackendUser): User {
  return {
    id: raw.id ?? raw._id ?? '',
    email: raw.email ?? '',
    username: raw.username ?? null,
    emailVerified: raw.emailVerified ?? raw.verified ?? raw.isVerified ?? false,
    status: raw.status ?? 'active',
    createdAt: raw.createdAt ?? '',
    updatedAt: raw.updatedAt ?? '',
    lastLoginAt: raw.lastLoginAt ?? null,
    authProvider: normalizeProvider(raw.authProvider ?? raw.provider),
  };
}

function normalizeProvider(
  value?: string,
): 'email' | 'google' | 'passkey' | undefined {
  if (!value) return undefined;
  const v = value.toLowerCase();
  if (v === 'google' || v === 'oauth') return 'google';
  if (v === 'passkey' || v === 'webauthn') return 'passkey';
  return 'email';
}

function extractUser(res: BackendAuthResponse): User {
  const raw = res.user ?? res.data;
  if (!raw) {
    throw new Error('Unexpected server response: no user data returned.');
  }
  return mapUser(raw);
}

// --- Public API ---

export const authApi = {
  async login(payload: LoginRequest): Promise<User> {
    const res = await apiClient.post<BackendAuthResponse>(
      '/auth/login',
      payload,
    );
    return extractUser(res);
  },

  async register(payload: RegisterRequest): Promise<User> {
    const res = await apiClient.post<BackendAuthResponse>(
      '/auth/register',
      payload,
    );
    return extractUser(res);
  },

  async verifyEmail(payload: VerifyEmailRequest): Promise<User> {
    const res = await apiClient.post<BackendAuthResponse>(
      '/auth/verify',
      payload,
    );
    return extractUser(res);
  },

  async logout(): Promise<void> {
    await apiClient.get<void>('/auth/logout');
  },

  async getPasskeyOptions(): Promise<PasskeyOptionsResponse> {
    return apiClient.get<PasskeyOptionsResponse>('/auth/passkey/options');
  },

  async verifyPasskey(payload: PasskeyVerifyRequest): Promise<User> {
    const res = await apiClient.post<BackendAuthResponse>(
      '/auth/passkey/verify',
      payload,
    );
    return extractUser(res);
  },

  /**
   * Session bootstrap — retrieves the currently authenticated user.
   *
   * Returns `null` when the user is not authenticated (401), which is an
   * expected state rather than an error. Any other failure is thrown so
   * the caller can surface a real error state.
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await apiClient.get<BackendAuthResponse>('/auth/me');
      return extractUser(res);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        return null;
      }
      throw err;
    }
  },

  getGoogleOAuthUrl(): string {
    return `${env.apiBaseUrl}/auth/google`;
  },
};
