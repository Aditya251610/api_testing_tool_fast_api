"use client";
import Link from "next/link";
import { useAuth } from "./components/AuthProvider";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Top Navigation for Landing Page */}
      <nav className="w-full px-6 py-6 absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all">
              AT
            </div>
            <span className="font-display font-bold text-xl text-gradient">
              API Tester
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="px-6 py-2.5 text-sm font-semibold text-white gradient-primary rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 text-sm font-semibold text-white gradient-primary rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 lg:py-32 pt-32">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center animate-slide-up">
          <h1 className="font-display font-bold text-5xl lg:text-7xl mb-6 leading-tight">
            Test Your APIs with
            <br />
            <span className="text-gradient">Lightning Speed</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A powerful, modern API testing tool built for developers. Execute requests, analyze responses, and track your testing history—all in one beautiful interface.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
            {user ? (
              <Link
                href="/dashboard"
                className="px-8 py-4 text-lg font-semibold text-white gradient-primary rounded-xl hover:shadow-2xl hover:shadow-indigo-500/40 transition-all transform hover:scale-105"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="px-8 py-4 text-lg font-semibold text-white gradient-primary rounded-xl hover:shadow-2xl hover:shadow-indigo-500/40 transition-all transform hover:scale-105"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 text-lg font-semibold text-gray-300 glass-effect rounded-xl hover:bg-white/10 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Feature Preview */}
          <div className="glass-effect-strong rounded-2xl p-8 max-w-5xl mx-auto shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-left">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Fast Execution</h3>
                <p className="text-sm text-gray-400">Execute API requests in milliseconds with detailed timing metrics</p>
              </div>

              <div className="text-left">
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Complete Logs</h3>
                <p className="text-sm text-gray-400">Track every request with comprehensive logging and history</p>
              </div>

              <div className="text-left">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Beautiful UI</h3>
                <p className="text-sm text-gray-400">Modern, intuitive interface designed for productivity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-transparent to-indigo-950/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-bold text-4xl text-center mb-16">
            Everything You Need to Test APIs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Multiple HTTP Methods",
                description: "Support for GET, POST, PUT, DELETE, PATCH, and more",
                icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              },
              {
                title: "Custom Headers",
                description: "Add any headers you need for authentication and configuration",
                icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              },
              {
                title: "Request Body",
                description: "Send JSON or text payloads with your requests",
                icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              },
              {
                title: "Query Parameters",
                description: "Easily add and manage URL query parameters",
                icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              },
              {
                title: "Response Analysis",
                description: "View status codes, headers, and formatted response bodies",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              },
              {
                title: "History Tracking",
                description: "Access your complete testing history with detailed logs",
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="glass-effect rounded-xl p-6 hover:bg-white/10 transition-all group animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center glass-effect-strong rounded-2xl p-12">
            <h2 className="font-display font-bold text-4xl mb-6">
              Ready to Start Testing?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join developers who trust API Tester for their testing needs
            </p>
            <Link
              href="/signup"
              className="inline-block px-10 py-4 text-lg font-semibold text-white gradient-primary rounded-xl hover:shadow-2xl hover:shadow-indigo-500/40 transition-all transform hover:scale-105"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}