"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface User {
  username: string;
  blogId: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string, blogId: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
            setUser({ username: data.username, blogId: data.blogId });
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

  const login = async (username: string, password: string, blogId: string) => {
    setError(null);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, blogId }),
      });

      if (response.ok) {
        const data = await response.json();

        setIsAuthenticated(true);
        setUser({ username: data.username, blogId: data.blogId });
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
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
      } else {
        setError("Failed to logout. Please try again.");
      }
    } catch (err) {
      setError(`An error occurred. Please try again. ${err}`);
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
