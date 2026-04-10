import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="h-full"
        style={{ backgroundColor: "#0A0A0B", color: "rgba(255,255,255,0.95)" }}
      >
        <Sidebar />
        <main
          className="ml-60 min-h-screen"
          style={{ backgroundColor: "#0A0A0B" }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
