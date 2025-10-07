"use client";
import { useState } from "react";
import { runTest } from "../../services/runner";

export default function DashboardPage() {
	const [url, setUrl] = useState("");
	const [method, setMethod] = useState("GET");
	const [result, setResult] = useState<any>(null);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		const res = await runTest({ url, method });
		setResult(res);
	};

	return (
		<div className="max-w-3xl mx-auto mt-12 p-6 bg-gray-800 rounded">
			<h2 className="text-xl mb-4">Run API Test</h2>
			<form onSubmit={submit} className="space-y-3">
				<input className="w-full p-2 bg-gray-700 rounded" placeholder="https://api.example.com/path" value={url} onChange={(e) => setUrl(e.target.value)} />
				<select className="w-full p-2 bg-gray-700 rounded" value={method} onChange={(e) => setMethod(e.target.value)}>
					<option>GET</option>
					<option>POST</option>
					<option>PUT</option>
					<option>DELETE</option>
				</select>
				<button className="w-full p-2 bg-indigo-600 rounded">Run</button>
			</form>

			{result && (
				<div className="mt-6 p-4 bg-gray-900 rounded">
					<pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>
				</div>
			)}
		</div>
	);
}
