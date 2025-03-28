"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

interface User {
  email: string;
  subdomain: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  bio?: string;
  socialLinks?: string;
  phoneNumber?: string;
  headline?: string;
  location?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  extraLink?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (newUserData: any) => void;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const initializationComplete = useRef(false);

  useEffect(() => {
    if (initializationComplete.current) return;

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/check-auth", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated);
          if (data.authenticated) {
            setUser({
              email: data.email,
              subdomain: data.subdomain,
              firstName: data.firstName,
              lastName: data.lastName,
              nickname: data.nickname,
              bio: data.bio,
              socialLinks: data.socialLinks,
              phoneNumber: data.phoneNumber,
              headline: data.headline,
              location: data.location,
              twitter: data.twitter,
              linkedin: data.linkedin,
              instagram: data.instagram,
              tiktok: data.tiktok,
              youtube: data.youtube,
              extraLink: data.extraLink,
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        initializationComplete.current = true;
      }
    };

    checkAuth();
  }, []);

  const updateUser = (newUserData: any) => {
    setUser((prev) => ({ ...prev, ...newUserData }));
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        // Set all user data in context
        setUser({
          email: data.email,
          subdomain: data.subdomain,
          firstName: data.firstName,
          lastName: data.lastName,
          nickname: data.nickname,
          bio: data.bio,
          socialLinks: data.socialLinks,
          phoneNumber: data.phoneNumber,
          headline: data.headline,
          location: data.location,
          twitter: data.twitter,
          linkedin: data.linkedin,
          instagram: data.instagram,
          tiktok: data.tiktok,
          youtube: data.youtube,
          extraLink: data.extraLink,
        });
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    updateUser,
    error,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
