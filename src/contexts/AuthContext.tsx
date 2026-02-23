import React, { createContext, useContext, useState, useCallback } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  tokenBalance: number;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  deductBalance: (amount: number) => void;
  addBalance: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const VALID_EMAIL = "rev.topup@outlook.com";
const VALID_PASS = "revtop.china";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState(153);

  const login = useCallback((email: string, password: string) => {
    if (email === VALID_EMAIL && password === VALID_PASS) {
      setIsAuthenticated(true);
      setUserEmail(email);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserEmail(null);
  }, []);

  const deductBalance = useCallback((amount: number) => {
    setTokenBalance((prev) => Math.max(0, prev - amount));
  }, []);

  const addBalance = useCallback((amount: number) => {
    setTokenBalance((prev) => prev + amount);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, tokenBalance, login, logout, deductBalance, addBalance }}>
      {children}
    </AuthContext.Provider>
  );
};
