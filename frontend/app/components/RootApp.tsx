"use client";
"use client";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "./AuthProvider";
import Navbar from "./Navbar";
import { usePathname, useRouter } from "next/navigation";

function ClientApp({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // If user not authenticated and not on login/signup pages, redirect to /login
    const publicPaths = ["/login", "/signup"];
    const isPublic = publicPaths.some((p) => pathname?.startsWith(p));
    if (!user && !isPublic) {
      router.push("/login");
    }
  }, [user, pathname, router]);

  return (
    <>
      <Navbar />
      <main className="p-6">{children}</main>
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
