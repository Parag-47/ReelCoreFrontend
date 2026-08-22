import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { authApi } from './api/auth.api';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
} from './auth.types';
import { authenticateWithPasskey } from './passkey';
import { ApiError } from '@/lib/api-client';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  verifyEmail: (payload: VerifyEmailRequest) => Promise<void>;
  loginWithPasskey: () => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        if (!cancelled) {
          setUser(currentUser);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error('Failed to restore session.'),
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const user = await authApi.login(payload);
    setUser(user);
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const user = await authApi.register(payload);
    setUser(user);
  }, []);

  const verifyEmail = useCallback(async (payload: VerifyEmailRequest) => {
    const user = await authApi.verifyEmail(payload);
    setUser(user);
  }, []);

  const loginWithPasskey = useCallback(async () => {
    const options = await authApi.getPasskeyOptions();
    const credential = await authenticateWithPasskey(options);
    const user = await authApi.verifyPasskey({ credential });
    setUser(user);
  }, []);

  const loginWithGoogle = useCallback(() => {
    window.location.assign(authApi.getGoogleOAuthUrl());
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        // network failure — still clear locally
      } else {
        throw err;
      }
    }
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    error,
    login,
    register,
    verifyEmail,
    loginWithPasskey,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
