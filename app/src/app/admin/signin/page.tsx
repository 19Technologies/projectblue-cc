"use client";

import { PublicShell } from "@/components/PublicShell";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

export default function AdminSignInPage() {
  // useSearchParams must sit inside a Suspense boundary for Next 16 to
  // prerender this route.
  return (
    <Suspense fallback={null}>
      <AdminSignInInner />
    </Suspense>
  );
}

function AdminSignInInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password required.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Login failed" }));
        toast.error(error || "Login failed");
        setBusy(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      toast.error("Network error.");
      setBusy(false);
    }
  };

  return (
    <PublicShell
      icon="lock"
      tone="ink"
      width="narrow"
      minimalHeader
      kicker="Restricted area"
      title={<>Sign in to admin<span className="pb-lg-dot">.</span></>}
    >
      <form onSubmit={onSubmit} className="pb-form-stack">
        <label className="pb-action-label" htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          className="pb-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@projectblue.cc"
        />

        <label className="pb-action-label" htmlFor="admin-password" style={{ marginTop: "1.25rem" }}>
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          className="pb-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <div className="pb-action-row">
          <button type="submit" disabled={busy} className="pb-action-btn">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </PublicShell>
  );
}
