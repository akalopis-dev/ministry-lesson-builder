"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EnterCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Incorrect code");
        setSubmitting(false);
        return;
      }
      const from = searchParams.get("from") || "/dashboard";
      router.push(from);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-md border border-border bg-paper p-6 shadow-elevated">
        <h1 className="font-heading text-lg font-semibold text-navy">Ministry Lesson Builder</h1>
        <p className="mt-1 text-sm text-charcoal-soft">Enter the shared team code to continue.</p>
        <input
          autoFocus
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Team code"
          className="mt-4 w-full rounded border border-border-strong bg-paper px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy"
        />
        {error && <p className="mt-2 text-xs text-burgundy">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !code}
          className="mt-4 w-full rounded bg-navy px-3.5 py-2 text-sm font-medium text-paper shadow-soft transition-all hover:shadow-elevated disabled:opacity-40"
        >
          {submitting ? "Checking…" : "Continue"}
        </button>
      </form>
    </div>
  );
}

export default function EnterCodePage() {
  return (
    <Suspense fallback={null}>
      <EnterCodeForm />
    </Suspense>
  );
}
