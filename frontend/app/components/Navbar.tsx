"use client";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { user, signout } = useAuth();

  return (
    <nav className="w-full p-4 bg-gray-900 text-gray-100 flex justify-between">
      <div className="font-bold">API Tester</div>
      <div className="space-x-4">
        <Link href="/">Home</Link>
        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/logs">Logs</Link>
            <button onClick={signout} className="ml-2 text-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
