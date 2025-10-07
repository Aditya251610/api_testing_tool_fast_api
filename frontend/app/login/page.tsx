"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();
    const router = useRouter();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const ok = await auth.signin({ username, password });
        if (ok) {
            router.push("/");
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-gray-800 rounded">
            <h2 className="text-xl mb-4">Login</h2>
            <form onSubmit={submit} className="space-y-3">
                <input className="w-full p-2 bg-gray-700 rounded" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" className="w-full p-2 bg-gray-700 rounded" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="w-full p-2 bg-indigo-600 rounded">Login</button>
            </form>
            {error && <div className="mt-3 text-red-400">{error}</div>}
        </div>
    );
}