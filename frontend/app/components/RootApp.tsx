"use client";
import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./AuthProvider";
import Navbar from "./Navbar";
import { usePathname, useRouter } from "next/navigation";

function ClientApp({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for auth to be initialized
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // Public paths that don't require authentication
    const publicPaths = ["/", "/login", "/signup"];
    const isPublicPath = publicPaths.includes(pathname);

    // Protected paths that require authentication
    const protectedPaths = ["/dashboard", "/logs"];
    const isProtectedPath = protectedPaths.some((p) => pathname.startsWith(p));

    // If user is not authenticated and trying to access protected route
    if (!user && !token && isProtectedPath) {
      router.push("/login");
    }
  }, [user, token, pathname, router, isReady]);

  // Pages without navbar
  const pagesWithoutNavbar = ["/", "/login", "/signup"];
  const shouldShowNavbar = !pagesWithoutNavbar.includes(pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main className="min-h-screen">{children}</main>
    </>
  );
}

export default function RootApp({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ClientApp>{children}</ClientApp>
    </AuthProvider>
  );
}
