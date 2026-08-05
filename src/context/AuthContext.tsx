import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi, type AdminUser, type AdminLoginPayload } from '@/api/auth';
import { AUTH_TOKEN_KEY } from '@/api/client';

interface AuthContextValue {
  admin: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (payload: AdminLoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(AUTH_TOKEN_KEY)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((user) => setAdmin(user))
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback(async (payload: AdminLoginPayload) => {
    const res = await authApi.login(payload);
    const jwt = res.token;
    const user = res.admin ?? res.user ?? { _id: '', name: 'Admin', email: payload.email };
    localStorage.setItem(AUTH_TOKEN_KEY, jwt);
    setToken(jwt);
    setAdmin(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setAdmin(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ admin, token, loading, login, logout }),
    [admin, token, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
