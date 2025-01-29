import { AuthProvider } from "@/components/providers/auth-context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abhinav Baldha",
  description: "Abhinav Baldha",
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
