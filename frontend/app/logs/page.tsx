"use client";
import { useEffect, useState } from "react";
import { getLogs } from "../../services/runner";
import Link from "next/link";

type LogEntry = {
  run_id: string;
  timestamp: string;
  url: string;
  method: string;
  response_status: number | null;
  elapsed_ms: number;
  error: string | null;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");

  useEffect(() => {
    getLogs()
      .then((r) => setLogs(r || []))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: number | null) => {
    if (!status) return "bg-gray-500";
    if (status >= 200 && status < 300) return "bg-green-500";
    if (status >= 300 && status < 400) return "bg-yellow-500";
    if (status >= 400 && status < 500) return "bg-orange-500";
    return "bg-red-500";
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

  const filteredLogs = logs.filter((log) => {
    const matchesText = log.url.toLowerCase().includes(filter.toLowerCase());
    const matchesMethod = methodFilter === "ALL" || log.method === methodFilter;
    return matchesText && matchesMethod;
  });

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display font-bold text-4xl mb-2 text-gradient">
            Request History
          </h1>
          <p className="text-gray-400">View and analyze your API test logs</p>
        </div>

        {/* Filters */}
        <div className="glass-effect-strong rounded-2xl p-6 mb-6 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by URL..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full md:w-auto px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 [&>option]:bg-gray-900 [&>option]:text-white"
              >
                <option value="ALL">ALL</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
            <span>Total: {logs.length} requests</span>
            <span>•</span>
            <span>Filtered: {filteredLogs.length} results</span>
          </div>
        </div>

        {/* Logs List */}
        {loading ? (
          <div className="glass-effect-strong rounded-2xl p-12 text-center">
            <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-indigo-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-400">Loading logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="glass-effect-strong rounded-2xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 mb-4">
              {logs.length === 0 ? "No logs yet" : "No logs match your filters"}
            </p>
            {logs.length === 0 && (
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 text-sm font-semibold text-white gradient-primary rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
              >
                Run Your First Test
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log, idx) => (
              <Link
                key={log.run_id}
                href={`/logs/${log.run_id}`}
                className="block glass-effect rounded-xl p-6 hover:bg-white/10 transition-all group animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-lg border ${getMethodColor(
                          log.method
                        )}`}
                      >
                        {log.method}
                      </span>
                      {log.response_status && (
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getStatusColor(log.response_status)}`}
                          ></div>
                          <span className="text-sm font-semibold text-gray-300">
                            {log.response_status}
                          </span>
                        </div>
                      )}
                      {log.error && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                          Error
                        </span>
                      )}
                      <span className="text-sm text-cyan-400 font-mono">
                        {log.elapsed_ms.toFixed(2)} ms
                      </span>
                    </div>

                    <div className="text-white font-medium mb-2 truncate group-hover:text-indigo-300 transition-colors">
                      {log.url}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                      <span>•</span>
                      <span className="font-mono">{log.run_id.slice(0, 8)}</span>
                    </div>
                  </div>

                  <svg
                    className="w-5 h-5 text-gray-500 group-hover:text-indigo-400 transition-colors flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}