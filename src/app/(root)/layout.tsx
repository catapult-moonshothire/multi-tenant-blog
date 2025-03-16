import { AuthProvider } from "@/components/providers/auth-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscribe.so – Your Words, Your Legacy",
  description:
    "Inscribe.so is a minimalist blogging platform for CEOs, founders, and thought leaders to own their content, build their brand, and ensure their ideas live on forever. Write without distractions. Publish on your own domain. Leave a lasting impact.",
  openGraph: {
    title: "Inscribe.so – Your Words, Your Legacy",
    description:
      "Inscribe.so is a minimalist blogging platform for CEOs, founders, and thought leaders to own their content, build their brand, and ensure their ideas live on forever. Write without distractions. Publish on your own domain. Leave a lasting impact.",
    type: "website",
    url: "http://inscribe.so",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <TooltipProvider>
        <main className={` antialiased`}>{children}</main>
      </TooltipProvider>
    </AuthProvider>
  );
}
