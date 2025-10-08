import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootApp from "./components/RootApp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "API Tester - Test Your APIs with Lightning Speed",
  description: "A powerful, modern API testing tool built for developers. Execute requests, analyze responses, and track your testing history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-100 min-h-screen`}
      >
        {/* AuthProvider and Navbar are client components */}
        <div id="__app_root">
          <RootApp>{children}</RootApp>
        </div>
      </body>
    </html>
  );
}
