"use client";
import { useState } from "react";
import { runTest } from "../../services/runner";

type KeyValuePair = { key: string; value: string };

export default function DashboardPage() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState<KeyValuePair[]>([{ key: "", value: "" }]);
  const [params, setParams] = useState<KeyValuePair[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [bodyType, setBodyType] = useState<"json" | "text">("json");
  const [timeout, setTimeout] = useState<number>(30);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addHeader = () => setHeaders([...headers, { key: "", value: "" }]);
  const removeHeader = (idx: number) => setHeaders(headers.filter((_, i) => i !== idx));
  const updateHeader = (idx: number, field: "key" | "value", val: string) => {
    const updated = [...headers];
    updated[idx][field] = val;
    setHeaders(updated);
  };

  const addParam = () => setParams([...params, { key: "", value: "" }]);
  const removeParam = (idx: number) => setParams(params.filter((_, i) => i !== idx));
  const updateParam = (idx: number, field: "key" | "value", val: string) => {
    const updated = [...params];
    updated[idx][field] = val;
    setParams(updated);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const headersObj = headers.reduce((acc, h) => {
        if (h.key) acc[h.key] = h.value;
        return acc;
      }, {} as Record<string, string>);

      const paramsObj = params.reduce((acc, p) => {
        if (p.key) acc[p.key] = p.value;
        return acc;
      }, {} as Record<string, string>);

      let bodyData: any = null;
      if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
        if (bodyType === "json") {
          try {
            bodyData = JSON.parse(body);
          } catch {
            setError("Invalid JSON in request body");
            setLoading(false);
            return;
          }
        } else {
          bodyData = body;
        }
      }

      const res = await runTest({
        url,
        method,
        headers: Object.keys(headersObj).length > 0 ? headersObj : null,
        params: Object.keys(paramsObj).length > 0 ? paramsObj : null,
        body: bodyData,
        timeout: timeout * 1000,
      });

      setResult(res);
    } catch (err: any) {
      setError(err?.body?.detail || "Failed to execute request");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number | null) => {
    if (!status) return "text-gray-400";
    if (status >= 200 && status < 300) return "text-green-400";
    if (status >= 300 && status < 400) return "text-yellow-400";
    if (status >= 400 && status < 500) return "text-orange-400";
    return "text-red-400";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display font-bold text-4xl mb-2 text-gradient">
            API Testing Dashboard
          </h1>
          <p className="text-gray-400">Build and execute API requests with ease</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Builder */}
          <div className="glass-effect-strong rounded-2xl p-6 animate-slide-up">
            <h2 className="font-semibold text-xl mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Request Builder
            </h2>

            <form onSubmit={submit} className="space-y-6">
              {/* Info Banner */}
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-indigo-300">
                    <strong>Tip:</strong> Select POST, PUT, or PATCH method to enable the request body field below.
                  </div>
                </div>
              </div>

              {/* URL and Method */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Request URL
                </label>
                <div className="flex gap-2">
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium [&>option]:bg-gray-900 [&>option]:text-white"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                    <option value="HEAD">HEAD</option>
                    <option value="OPTIONS">OPTIONS</option>
                  </select>
                  <input
                    type="url"
                    required
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://api.example.com/endpoint"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>

              {/* Headers */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    Headers
                  </label>
                  <button
                    type="button"
                    onClick={addHeader}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    + Add Header
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                  {headers.map((header, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Key"
                        value={header.key}
                        onChange={(e) => updateHeader(idx, "key", e.target.value)}
                      />
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) => updateHeader(idx, "value", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeHeader(idx)}
                        className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Query Params */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    Query Parameters
                  </label>
                  <button
                    type="button"
                    onClick={addParam}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    + Add Parameter
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                  {params.map((param, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Key"
                        value={param.key}
                        onChange={(e) => updateParam(idx, "key", e.target.value)}
                      />
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Value"
                        value={param.value}
                        onChange={(e) => updateParam(idx, "value", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeParam(idx)}
                        className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Body */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    Request Body
                    {!(method === "POST" || method === "PUT" || method === "PATCH") && (
                      <span className="ml-2 text-xs text-gray-500">(Not available for {method})</span>
                    )}
                  </label>
                  {(method === "POST" || method === "PUT" || method === "PATCH") && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setBodyType("json")}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                          bodyType === "json"
                            ? "bg-indigo-500 text-white"
                            : "bg-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        JSON
                      </button>
                      <button
                        type="button"
                        onClick={() => setBodyType("text")}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                          bodyType === "text"
                            ? "bg-indigo-500 text-white"
                            : "bg-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        Text
                      </button>
                    </div>
                  )}
                </div>
                <textarea
                  disabled={!(method === "POST" || method === "PUT" || method === "PATCH")}
                  className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm scrollbar-thin transition-opacity ${
                    !(method === "POST" || method === "PUT" || method === "PATCH")
                      ? "opacity-40 cursor-not-allowed"
                      : ""
                  }`}
                  rows={6}
                  placeholder={
                    !(method === "POST" || method === "PUT" || method === "PATCH")
                      ? `Request body not supported for ${method} requests`
                      : bodyType === "json"
                      ? '{\n  "key": "value"\n}'
                      : "Enter text body"
                  }
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>

              {/* Timeout */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={timeout}
                  onChange={(e) => setTimeout(Number(e.target.value))}
                />
              </div>

              {error && (
                <div className="status-error rounded-lg px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-base font-semibold text-white gradient-primary rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Request...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Send Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Response Viewer */}
          <div className="glass-effect-strong rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <h2 className="font-semibold text-xl mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Response
            </h2>

            {!result ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-sm">Send a request to see the response</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status and Timing */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Status</div>
                      <div className={`text-2xl font-bold ${getStatusColor(result.response_status)}`}>
                        {result.response_status || "Error"}
                      </div>
                    </div>
                    <div className="h-12 w-px bg-white/10"></div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Time</div>
                      <div className="text-lg font-semibold text-cyan-400">
                        {result.elapsed_ms.toFixed(2)} ms
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleString()}
                  </div>
                </div>

                {/* Error Message */}
                {result.error && (
                  <div className="status-error rounded-xl px-4 py-3">
                    <div className="font-semibold mb-1">Error</div>
                    <div className="text-sm">{result.error}</div>
                  </div>
                )}

                {/* Response Headers */}
                {result.response_headers && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm text-gray-300">Response Headers</h3>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(result.response_headers, null, 2))}
                        className="text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="code-block max-h-48 overflow-y-auto scrollbar-thin">
                      <pre className="text-xs">
                        {JSON.stringify(result.response_headers, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Response Body */}
                {result.response_body && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm text-gray-300">Response Body</h3>
                      <button
                        onClick={() => copyToClipboard(result.response_body)}
                        className="text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="code-block max-h-96 overflow-y-auto scrollbar-thin">
                      <pre className="text-xs whitespace-pre-wrap break-words">
                        {(() => {
                          try {
                            return JSON.stringify(JSON.parse(result.response_body), null, 2);
                          } catch {
                            return result.response_body;
                          }
                        })()}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}