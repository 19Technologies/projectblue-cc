"use client";

import {
  generateRoomCode,
  normalizeRoomCode,
  validatePartialRoomCode,
  validateRoomCode,
} from "@/lib/roomCode";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BetaRequestForm } from "./BetaRequestForm";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { GlassIcon } from "./LiquidGlass";

export const Welcome = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate after mount to avoid SSR/client hydration mismatch.
  // The setState-in-effect lint rule is acknowledged but unavoidable here —
  // the code must be random per visit, so it cannot be computed during SSR.
  useEffect(() => {
    const fresh = generateRoomCode();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(fresh);
    queueMicrotask(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, []);

  const openRoom = (raw: string) => {
    const value = raw.trim().toUpperCase();
    if (!validateRoomCode(value)) {
      toast.error("Room codes are six characters — letters and numbers.");
      inputRef.current?.focus();
      return;
    }
    setBusy(true);
    router.push(`/room/${value}`);
  };

  const onShuffle = () => {
    setCode(generateRoomCode());
    queueMicrotask(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openRoom(code);
  };

  return (
    <div className="pb-welcome pb-shell">
      <Header />

      <main id="main" className="pb-shell-main">
        <div className="pb-shell-head">
          <GlassIcon icon="door" tone="tide" size="lg" />
          <p className="pb-lg-eyebrow">Start a room</p>
          <h1 className="pb-shell-title">
            Listen together.
            <br />
            Even when you&apos;re apart<span className="pb-lg-dot">.</span>
          </h1>
        </div>

        <div className="pb-lg-card pb-shell-card pb-shell-card--narrow">
          <form onSubmit={onSubmit} className="pb-action-form">
            <label htmlFor="room-code" className="pb-action-label">
              Room code
            </label>
            <input
              ref={inputRef}
              id="room-code"
              type="text"
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              autoCapitalize="characters"
              maxLength={6}
              className="pb-code-input"
              value={code}
              placeholder="4ED678"
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) => {
                const v = normalizeRoomCode(e.target.value);
                if (validatePartialRoomCode(v)) setCode(v);
              }}
            />
            <div className="pb-action-row">
              <button
                type="submit"
                disabled={busy || code.length !== 6}
                className="pb-action-btn"
              >
                {busy ? "Opening…" : "Open room"}
              </button>
              <button
                type="button"
                onClick={onShuffle}
                className="pb-lg-pill pb-lg-pill--lg"
              >
                Shuffle code
              </button>
            </div>
          </form>
        </div>

        <div className="pb-shell-after">
          <BetaRequestForm />
        </div>
      </main>

      <Footer />
    </div>
  );
};
