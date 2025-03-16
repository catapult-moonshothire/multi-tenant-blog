import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Inscribe.so – Your Words, Your Legacy",
  description:
    "  Inscribe.so is a minimalist blogging platform for CEOs, founders, and thought leaders to own their content, build their brand, and ensure their ideas live on forever. Write without distractions. Publish on your own domain. Leave a lasting impact.",
  alternates: {
    canonical: "https://inscribe.so",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <TooltipProvider>
        <body className={`${geistSans.variable} antialiased`}>{children}</body>
        <Toaster />
      </TooltipProvider>
    </html>
  );
}
