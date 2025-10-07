"use client";
import { useEffect, useState } from "react";
import { getLogs } from "../../services/runner";

export default function LogsPage() {
	const [logs, setLogs] = useState<any[]>([]);

	useEffect(() => {
		getLogs().then((r) => setLogs(r || []));
	}, []);

	return (
		<div className="max-w-4xl mx-auto mt-12 p-6 bg-gray-800 rounded">
			<h2 className="text-xl mb-4">Logs</h2>
			<div className="space-y-3">
				{logs.length === 0 && <div className="text-sm">No logs yet</div>}
				{logs.map((l) => (
					<div key={l.run_id} className="p-3 bg-gray-900 rounded">
						<div className="text-sm">{l.run_id} — {l.url}</div>
						<div className="text-xs text-gray-400">{l.timestamp}</div>
					</div>
				))}
			</div>
		</div>
	);
}
