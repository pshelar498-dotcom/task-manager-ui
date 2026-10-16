import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/authApi";
import { setUnauthorizedHandler } from "../api/axios";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  // While a saved token is being checked with the API, show a loader instead of the pages
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));

  const saveSession = useCallback((token, nextUser) => {
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  // Expired or invalid token anywhere in the app → log out
  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  // On page load, refresh the user from the API (their name or role may have changed)
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    authApi
      .getMe()
      .then((me) => saveSession(null, me))
      .catch(() => {}) // a 401 is handled by the axios interceptor; keep the stored user if the API is down
      .finally(() => setLoading(false));
  }, [saveSession]);

  const login = useCallback(
    async (credentials) => {
      const { user: loggedIn, token } = await authApi.login(credentials);
      saveSession(token, loggedIn);
      return loggedIn;
    },
    [saveSession]
  );

  const register = useCallback(
    async (data) => {
      const { user: created, token } = await authApi.register(data);
      saveSession(token, created);
      return created;
    },
    [saveSession]
  );

  const updateUser = useCallback((nextUser) => saveSession(null, nextUser), [saveSession]);
  const updateToken = useCallback((token) => localStorage.setItem("token", token), []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
      updateUser,
      updateToken,
    }),
    [user, loading, login, register, logout, updateUser, updateToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
};
