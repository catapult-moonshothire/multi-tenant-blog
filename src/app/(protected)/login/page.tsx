"use client";

import LoginForm from "@/components/login-form";
import { useAuth } from "@/components/providers/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Admin() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, router]);

  return <LoginForm />;
}
