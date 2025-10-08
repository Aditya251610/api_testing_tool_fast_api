"use client";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { user, signout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    signout();
    router.push("/");
  };

  return (
    <nav className="w-full px-6 py-4 glass-effect-strong sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all">
            AT
          </div>
          <span className="font-display font-bold text-xl text-gradient">
            API Tester
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
              isActive("/") ? "text-indigo-400" : "text-gray-300"
            }`}
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
                  isActive("/dashboard") ? "text-indigo-400" : "text-gray-300"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/logs"
                className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
                  isActive("/logs") ? "text-indigo-400" : "text-gray-300"
                }`}
              >
                Logs
              </Link>
              <div className="flex items-center gap-3 ml-2 pl-6 border-l border-white/10">
                <span className="text-sm text-gray-400">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white gradient-primary rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}