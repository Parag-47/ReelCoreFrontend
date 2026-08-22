import { apiClient } from "@/lib/api-client";
import type {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  PasskeyOptionsResponse,
  PasskeyVerifyRequest,
  User,
} from "../auth.types";
import { env } from "@/config/env";

// --- Backend response shapes (kept private to this adapter) ---

interface BackendUser {
  id?: string;
  _id?: string;
  email?: string;
  username?: string;
  isVerified?: boolean;
  verified?: boolean;
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
    id: raw.id ?? raw._id ?? "",
    email: raw.email ?? "",
    username: raw.username,
    isVerified: raw.isVerified ?? raw.verified,
    authProvider: normalizeProvider(raw.authProvider ?? raw.provider),
  };
}

function normalizeProvider(
  value?: string,
): "email" | "google" | "passkey" | undefined {
  if (!value) return undefined;
  const v = value.toLowerCase();
  if (v === "google" || v === "oauth") return "google";
  if (v === "passkey" || v === "webauthn") return "passkey";
  return "email";
}

function extractUser(res: BackendAuthResponse): User {
  const raw = res.user ?? res.data;
  if (!raw) {
    throw new Error("Unexpected server response: no user data returned.");
  }
  return mapUser(raw);
}

// --- Public API ---

export const authApi = {
  async login(payload: LoginRequest): Promise<User> {
    const res = await apiClient.post<BackendAuthResponse>(
      "/auth/login",
      payload,
    );
    return extractUser(res);
  },

  async register(payload: RegisterRequest): Promise<User> {
    const res = await apiClient.post<BackendAuthResponse>(
      "/auth/register",
      payload,
    );
    return extractUser(res);
  },

  async verifyEmail(payload: VerifyEmailRequest): Promise<User> {
    const res = await apiClient.post<BackendAuthResponse>(
      "/auth/verify",
      payload,
    );
    return extractUser(res);
  },

  async logout(): Promise<void> {
    await apiClient.get<void>("/auth/logout");
  },

  async getPasskeyOptions(): Promise<PasskeyOptionsResponse> {
    return apiClient.get<PasskeyOptionsResponse>("/auth/passkey/options");
  },

  async verifyPasskey(payload: PasskeyVerifyRequest): Promise<User> {
    const res = await apiClient.post<BackendAuthResponse>(
      "/auth/passkey/verify",
      payload,
    );
    return extractUser(res);
  },

  /**
   * Session bootstrap — retrieves the currently authenticated user.
   *
   * Integration point: if ReelCore exposes a different endpoint (e.g. GET /auth/session),
   * update only this method. The rest of the app does not depend on the endpoint path.
   *
   * If the backend does not yet expose a current-user endpoint, this will return null
   * (via the caller catching the 401/404), and the user will be treated as logged out.
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await apiClient.get<BackendAuthResponse>("/auth/me");
      return extractUser(res);
    } catch {
      return null;
    }
  },

  getGoogleOAuthUrl(): string {
    return `${env.apiBaseUrl}/auth/google`;
  },
};
