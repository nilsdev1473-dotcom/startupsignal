import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "StartupSignal — Intelligence Dashboard",
  description:
    "Bloomberg Terminal meets startup graveyard. Dark, data-dense, premium intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="h-full"
        style={{ backgroundColor: "#0A0A0B", color: "rgba(255,255,255,0.95)" }}
      >
        <Sidebar />
        <main
          className="lg:ml-60 min-h-screen pb-16 lg:pb-0"
          style={{ backgroundColor: "#0A0A0B" }}
        >
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
