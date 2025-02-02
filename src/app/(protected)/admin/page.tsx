"use client";

import BlogPostDisplay from "@/components/blog-post-display";
import MainContainer from "@/components/layout/main-container";
import { useAuth } from "@/components/providers/auth-context";
import Head from "next/head";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Admin() {
  const { isAuthenticated } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    redirect("/login");
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
