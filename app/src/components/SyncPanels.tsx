"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GlassWindow } from "./GlassWindow";

const DURATION = 228; // 3:48
const START_AT = 102; // 1:42

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
}

const buildRows = (now: Date | null, viewerZone: string | null): Row[] => {
  if (!now) {
    return [
      { key: "you", name: "You", place: "right here", clock: "--:--" },
      ...FRIENDS.slice(0, 3).map((f) => ({
        key: f.timeZone,
        name: f.name,
        place: f.city,
        clock: "--:--",
      })),
    ];
  }

  const you = localClock(now);
  const city = viewerZone?.includes("/")
    ? viewerZone.split("/").pop()!.replace(/_/g, " ")
    : "right here";
  const rows: Row[] = [
    { key: "you", name: "You", place: `${city}, ${moodFor(you.hour)}`, clock: you.label },
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
    });
  }
  return rows;
};

const Track = ({ fraction }: { fraction: number }) => (
  <div
    className="pb-lg-track"
    style={{ "--f": fraction.toFixed(4) } as React.CSSProperties}
    aria-hidden
  >
    <span className="pb-lg-track-fill" />
    <span className="pb-lg-track-thumb" />
  </div>
);

/**
 * The hero's two floating windows: the room, and everyone in it. Each listener
 * is a slider, and every thumb sits on the same second — the visitor's real
 * local time on top, three friends in other cities below.
 */
export const SyncPanels = () => {
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
    <div className={`pb-lg-panels${pos === 0 ? " is-wrapping" : ""}`}>
      <GlassWindow title="Room" className="pb-lg-window--room">
        <p className="pb-lg-section-label">Room</p>
        <dl className="pb-lg-facts">
          <div>
            <dt>Code</dt>
            <dd className="pb-lg-mono">4ED678</dd>
          </div>
          <div>
            <dt>Listening</dt>
            <dd className="pb-lg-mono">{rows.length}</dd>
          </div>
          <div>
            <dt>Track</dt>
            <dd>Your song here</dd>
          </div>
          <div>
            <dt>Position</dt>
            <dd className="pb-lg-mono">
              {mmss(pos)} <span className="pb-lg-faint">/ {mmss(DURATION)}</span>
            </dd>
          </div>
        </dl>
        <Track fraction={fraction} />
      </GlassWindow>

      <GlassWindow title="Listeners" className="pb-lg-window--listeners">
        <p className="pb-lg-section-label">
          {playing ? "Playing for everyone" : "Paused for everyone"}
        </p>
        <ul className="pb-lg-listeners">
          {rows.map((r) => (
            <li key={r.key}>
              <div className="pb-lg-listener-head">
                <span className="pb-lg-listener-name">{r.name}</span>
                <time className="pb-lg-mono">{r.clock}</time>
              </div>
              <span className="pb-lg-listener-place">{r.place}</span>
              <Track fraction={fraction} />
            </li>
          ))}
        </ul>
        <div className="pb-lg-window-actions">
          <button
            type="button"
            className="pb-lg-btn"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause for everyone" : "Play for everyone"}
          >
            {playing ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            className="pb-lg-btn pb-lg-btn--quiet"
            onClick={() => setPos(0)}
            aria-label="Restart the song for everyone"
          >
            <RotateCcw size={14} aria-hidden />
            Restart
          </button>
        </div>
        <p className="pb-lg-window-note">
          Those local times are real. The top one is yours.
        </p>
      </GlassWindow>
    </div>
  );
};
