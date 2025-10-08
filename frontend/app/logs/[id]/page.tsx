"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLogById } from "../../../services/runner";
import Link from "next/link";

type LogDetail = {
  run_id: string;
  timestamp: string;
  url: string;
  method: string;
  response_status: number | null;
  response_headers: Record<string, string> | null;
  response_body: string | null;
  elapsed_ms: number;
  error: string | null;
  user_id: string;
};

export default function LogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [log, setLog] = useState<LogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      getLogById(params.id as string)
        .then((data) => setLog(data))
        .catch((err) => setError(err?.body?.detail || "Failed to load log"))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  const getStatusColor = (status: number | null) => {
    if (!status) return "text-gray-400";
    if (status >= 200 && status < 300) return "text-green-400";
    if (status >= 300 && status < 400) return "text-yellow-400";
    if (status >= 400 && status < 500) return "text-orange-400";
    return "text-red-400";
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      POST: "bg-green-500/20 text-green-400 border-green-500/30",
      PUT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      PATCH: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colors[method] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-8 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-indigo-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400">Loading log details...</p>
        </div>
      </div>
    );
  }

  if (error || !log) {
    return (
      <div className="min-h-screen px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect-strong rounded-2xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Log Not Found</h2>
            <p className="text-gray-400 mb-6">{error || "The requested log could not be found"}</p>
            <Link
              href="/logs"
              className="inline-block px-6 py-3 text-sm font-semibold text-white gradient-primary rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              Back to Logs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Logs
          </button>
          <h1 className="font-display font-bold text-4xl mb-2 text-gradient">
            Request Details
          </h1>
          <p className="text-gray-400">Complete information about this API request</p>
        </div>

        <div className="space-y-6">
          {/* Overview Card */}
          <div className="glass-effect-strong rounded-2xl p-6 animate-slide-up">
            <h2 className="font-semibold text-xl mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-2">Method</div>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-lg border ${getMethodColor(log.method)}`}>
                  {log.method}
                </span>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-2">Status</div>
                <div className={`text-2xl font-bold ${getStatusColor(log.response_status)}`}>
                  {log.response_status || "Error"}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-2">Response Time</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {log.elapsed_ms.toFixed(2)} ms
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-2">Timestamp</div>
                <div className="text-sm font-semibold text-gray-300">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <div className="text-xs text-gray-400 mb-2">Request URL</div>
              <div className="flex items-center justify-between gap-4">
                <code className="text-sm text-white font-mono break-all">{log.url}</code>
                <button
                  onClick={() => copyToClipboard(log.url)}
                  className="flex-shrink-0 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-white/5 rounded-xl">
              <div className="text-xs text-gray-400 mb-2">Run ID</div>
              <code className="text-sm text-gray-300 font-mono">{log.run_id}</code>
            </div>
          </div>

          {/* Error Message */}
          {log.error && (
            <div className="glass-effect-strong rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <h2 className="font-semibold text-xl mb-4 flex items-center gap-2 text-red-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Error
              </h2>
              <div className="status-error rounded-xl px-4 py-3">
                <pre className="text-sm whitespace-pre-wrap break-words">{log.error}</pre>
              </div>
            </div>
          )}

          {/* Response Headers */}
          {log.response_headers && (
            <div className="glass-effect-strong rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-xl flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Response Headers
                </h2>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(log.response_headers, null, 2))}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Copy All
                </button>
              </div>
              <div className="code-block max-h-96 overflow-y-auto scrollbar-thin">
                <pre className="text-xs">
                  {JSON.stringify(log.response_headers, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Response Body */}
          {log.response_body && (
            <div className="glass-effect-strong rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-xl flex items-center gap-2">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Response Body
                </h2>
                <button
                  onClick={() => copyToClipboard(log.response_body!)}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Copy All
                </button>
              </div>
              <div className="code-block max-h-[600px] overflow-y-auto scrollbar-thin">
                <pre className="text-xs whitespace-pre-wrap break-words">
                  {(() => {
                    try {
                      return JSON.stringify(JSON.parse(log.response_body), null, 2);
                    } catch {
                      return log.response_body;
                    }
                  })()}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}