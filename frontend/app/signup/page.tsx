"use client";
import { useState } from "react";
import { signup as apiSignup } from "../../services/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		await apiSignup({ username, email, password });
		router.push("/login");
	};

	return (
		<div className="max-w-md mx-auto mt-20 p-6 bg-gray-800 rounded">
			<h2 className="text-xl mb-4">Sign up</h2>
			<form onSubmit={submit} className="space-y-3">
				<input className="w-full p-2 bg-gray-700 rounded" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
				<input className="w-full p-2 bg-gray-700 rounded" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input type="password" className="w-full p-2 bg-gray-700 rounded" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button className="w-full p-2 bg-indigo-600 rounded">Sign up</button>
			</form>
		</div>
	);
}
