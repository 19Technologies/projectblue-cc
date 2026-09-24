"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const DURATION = 228; // 3:48
const START_AT = 102; // 1:42

/* One waveform, shared by every row — it's the same song for everyone.
   Rounded so server and browser engines produce identical markup. */
const WAVE = Array.from({ length: 64 }, (_, i) => {
  const v =
    Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11)) * 0.7 +
    Math.abs(Math.sin(i * 1.7)) * 0.3;
  return Math.round((0.18 + v * 0.82) * 100);
});

interface Friend {
  name: string;
  city: string;
  timeZone: string;
}

// Ordered so the first three picks usually land in far-apart time zones.
const FRIENDS: Friend[] = [
  { name: "Amara", city: "London", timeZone: "Europe/London" },
  { name: "Jonah", city: "New York", timeZone: "America/New_York" },
  { name: "Mei", city: "Tokyo", timeZone: "Asia/Tokyo" },
  { name: "Luiz", city: "São Paulo", timeZone: "America/Sao_Paulo" },
  { name: "Ruby", city: "Sydney", timeZone: "Australia/Sydney" },
  { name: "Anya", city: "Mumbai", timeZone: "Asia/Kolkata" },
  { name: "Tobi", city: "Lagos", timeZone: "Africa/Lagos" },
];

const moodFor = (hour: number): string => {
  if (hour < 3) return "up far too late";
  if (hour < 6) return "can't sleep";
  if (hour < 9) return "first coffee";
  if (hour < 12) return "at the desk";
  if (hour < 14) return "lunch break";
  if (hour < 17) return "afternoon slump";
  if (hour < 20) return "cooking dinner";
  return "winding down";
};

const localClock = (now: Date, timeZone?: string) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).formatToParts(now);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return { label: `${hour}:${minute}`, hour: Number(hour) };
};

const mmss = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

interface Row {
  key: string;
  name: string;
  place: string;
  clock: string;
  isYou: boolean;
}

const buildRows = (now: Date | null, viewerZone: string | null): Row[] => {
  if (!now) {
    return [
      { key: "you", name: "You", place: "right here", clock: "--:--", isYou: true },
      ...FRIENDS.slice(0, 3).map((f) => ({
        key: f.timeZone,
        name: f.name,
        place: f.city,
        clock: "--:--",
        isYou: false,
      })),
    ];
  }

  const you = localClock(now);
  const city = viewerZone?.includes("/")
    ? viewerZone.split("/").pop()!.replace(/_/g, " ")
    : "right here";
  const rows: Row[] = [
    {
      key: "you",
      name: "You",
      place: `${city}, ${moodFor(you.hour)}`,
      clock: you.label,
      isYou: true,
    },
  ];

  // Three friends, each on a different local time from you and each other.
  const seen = new Set([you.label]);
  for (const f of FRIENDS) {
    if (rows.length === 4) break;
    const t = localClock(now, f.timeZone);
    if (seen.has(t.label)) continue;
    seen.add(t.label);
    rows.push({
      key: f.timeZone,
      name: f.name,
      place: `${f.city}, ${moodFor(t.hour)}`,
      clock: t.label,
      isYou: false,
    });
  }
  return rows;
};

const Wave = ({ className }: { className: string }) => (
  <div className={`pb-wave ${className}`} aria-hidden>
    {WAVE.map((h, i) => (
      <span key={i} style={{ height: `${h}%` }} />
    ))}
  </div>
);

/**
 * The landing-page demo: the visitor's real local time next to three
 * friends in other cities, all on the same second of the same song.
 * Pause stops it for "everyone", which is the product in one button.
 */
export const SyncBoard = () => {
  const [now, setNow] = useState<Date | null>(null);
  const [viewerZone, setViewerZone] = useState<string | null>(null);
  const [pos, setPos] = useState(START_AT);
  const [playing, setPlaying] = useState(true);
  const playingRef = useRef(playing);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const first = setTimeout(() => {
      setViewerZone(Intl.DateTimeFormat().resolvedOptions().timeZone ?? null);
      setNow(new Date());
    }, 0);
    const id = setInterval(() => {
      setNow(new Date());
      if (playingRef.current) setPos((p) => (p + 1) % DURATION);
    }, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const rows = useMemo(() => buildRows(now, viewerZone), [now, viewerZone]);
  const fraction = pos / DURATION;

  return (
    <figure
      className={`pb-sync${playing ? "" : " is-paused"}${pos === 0 ? " is-wrapping" : ""}`}
      style={
        {
          "--pb-sync-p": `${(fraction * 100).toFixed(3)}%`,
          "--pb-sync-f": fraction.toFixed(5),
        } as React.CSSProperties
      }
    >
      <div className="pb-sync-deck">
        <p className="pb-sync-stamp">
          <span className="pb-sync-code">4ED678</span>
          <span className="pb-room-dot is-live" aria-hidden />
          <span>{rows.length} listening</span>
        </p>

        <p className="pb-sync-label">
          <span className={`pb-playing-bars${playing ? "" : " is-paused"}`} aria-hidden>
            <span />
            <span />
            <span />
          </span>
          {playing ? "Playing for everyone" : "Paused for everyone"}
        </p>

        <p className="pb-sync-time" aria-hidden>
          {mmss(pos)}
          <span className="pb-sync-dur"> / {mmss(DURATION)}</span>
        </p>
        <p className="pb-sync-track">Your song here.</p>

        <button
          type="button"
          className="pb-sync-btn"
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? <Pause size={16} strokeWidth={2.5} aria-hidden /> : <Play size={16} strokeWidth={2.5} aria-hidden />}
          {playing ? "Pause for everyone" : "Play for everyone"}
        </button>
      </div>

      <div className="pb-sync-board">
        <ul className="pb-sync-list" aria-label="People in this room">
          {rows.map((r) => (
            <li key={r.key} className={`pb-sync-row${r.isYou ? " is-you" : ""}`}>
              <div className="pb-sync-who">
                <span className="pb-sync-name">{r.name}</span>
                <span className="pb-sync-place">{r.place}</span>
              </div>
              <div className="pb-sync-lane">
                <Wave className="is-base" />
                <Wave className="is-played" />
              </div>
              <time className="pb-sync-clock">{r.clock}</time>
            </li>
          ))}
        </ul>
        <div className="pb-sync-line" aria-hidden />
      </div>

      <figcaption className="pb-sync-caption">
        Those local times are real, and the top one is yours. Different hours,
        different days, the same second of the same song.
      </figcaption>
    </figure>
  );
};
