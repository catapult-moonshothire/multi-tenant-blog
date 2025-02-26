import { AuthProvider } from "@/components/providers/auth-context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscribe.so – Your Words, Your Legacy",
  description:
    "  Inscribe.so is a minimalist blogging platform for CEOs, founders, and thought leaders to own their content, build their brand, and ensure their ideas live on forever. Write without distractions. Publish on your own domain. Leave a lasting impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
