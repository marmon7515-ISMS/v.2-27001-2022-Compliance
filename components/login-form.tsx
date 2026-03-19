"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  async function submit() {
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Login fallito.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      <input
        className="rounded-xl border px-3 py-2"
        placeholder="Username"
        value={form.username}
        onChange={(event) => setForm((state) => ({ ...state, username: event.target.value }))}
      />
      <input
        className="rounded-xl border px-3 py-2"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(event) => setForm((state) => ({ ...state, password: event.target.value }))}
      />
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      <button className="rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={submit}>
        Accedi
      </button>
    </div>
  );
}
