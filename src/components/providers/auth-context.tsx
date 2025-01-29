"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  username: string;
  subdomain: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/check-auth");
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated);
          if (data.authenticated) {
            setUser({ username: data.username, subdomain: data.subdomain });
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        setError("Error checking authentication.");
        console.error(err);
      }
    };
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setError(null);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser({ username: data.username, subdomain: data.subdomain });
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(`An error occurred. Please try again. ${err}`);
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
    } catch (err) {
      setError("Error logging out.");
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
