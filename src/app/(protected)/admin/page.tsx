"use client";

import BlogPostDisplay from "@/components/blog-post-display";
import MainContainer from "@/components/layout/main-container";
import { useAuth } from "@/components/providers/auth-context";
import { IosSpinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginForm = dynamic(() => import("@/components/login-form"), {
  ssr: false,
  loading: () => (
    <div className="flex h-dvh items-center justify-center">
      <IosSpinner />,
    </div>
  ),
});

export default function Admin() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <MainContainer className="" large={true}>
        <BlogPostDisplay />
      </MainContainer>
    </>
  );
}
