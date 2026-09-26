import Link from "next/link";
import { BetaRequestForm } from "./BetaRequestForm";
import { WordMark } from "./BrandMark";
import { Footer } from "./Footer";
import { GlassCapsule, GlassIcon, type GlassIconName, type GlassTone } from "./LiquidGlass";
import { ThemeToggle } from "./ThemeToggle";

const HERO_ICONS: [GlassIconName, GlassTone][] = [
  ["headphones", "sunset"],
  ["users", "tide"],
  ["play", "grove"],
  ["message", "ember"],
  ["link", "bloom"],
];

const STEPS: { icon: GlassIconName; tone: GlassTone; title: string; body: React.ReactNode }[] = [
  {
    icon: "door",
    tone: "tide",
    title: "Open a room",
    body: (
      <>
        You get a code like <span className="pb-lg-code">4ED678</span>.
        That&apos;s the whole address.
      </>
    ),
  },
  {
    icon: "send",
    tone: "bloom",
    title: "Share six characters",
    body: (
      <>
        Text it, say it out loud, write it on a napkin. Anyone with the code
        joins straight from their browser. No account, nothing to install.
      </>
    ),
  },
  {
    icon: "play",
    tone: "grove",
    title: "Press play once",
    body: (
      <>
        Drop in audio files or paste a YouTube link, or a whole playlist.
        Play, pause and skip land for everyone at the same moment.
      </>
    ),
  },
];

const FEATURES: { icon: GlassIconName; tone: GlassTone; title: string; body: string }[] = [
  { icon: "music", tone: "sunset", title: "Plays", body: "Audio files you upload, YouTube videos and whole playlists." },
  { icon: "list", tone: "tide", title: "Queue", body: "One shared queue, with shuffle and repeat." },
  { icon: "message", tone: "ember", title: "Talk", body: "A chat that sits next to the music." },
  { icon: "crown", tone: "ink", title: "Control", body: "The host decides whether guests can add tracks." },
  { icon: "hash", tone: "bloom", title: "Joining", body: "Six characters. No account needed." },
  { icon: "devices", tone: "grove", title: "Works on", body: "Phones and laptops, right in the browser." },
];

/**
 * The projectblue.cc front page during the private beta: explains the
 * product and collects access requests. Invited people start rooms at
 * /start; beta.projectblue.cc redirects here (see next.config.ts).
 * Liquid glass on the icons and nav via @samasante/liquid-glass.
 */
export const ApexLanding = () => {
  return (
    <div className="pb-lg">
      <header className="pb-lg-header">
        <GlassCapsule className="pb-lg-capsule">
          <WordMark asLink />
          <span className="pb-lg-beta">Beta</span>
          <nav className="pb-lg-links" aria-label="Sections">
            <a href="#how">How it works</a>
            <a href="#room">In a room</a>
            <a href="#request">Invite</a>
          </nav>
          <span className="pb-lg-spacer" aria-hidden />
          <Link href="/start" className="pb-lg-pill pb-lg-hide-sm">
            Start a room
          </Link>
          <a href="#request" className="pb-lg-pill pb-lg-pill--solid">
            <span className="pb-lg-long">Request an invite</span>
            <span className="pb-lg-short">Get an invite</span>
          </a>
          <ThemeToggle variant="icon" />
        </GlassCapsule>
      </header>

      <main id="main">
        <section className="pb-lg-hero" aria-labelledby="pb-lg-title">
          <div className="pb-lg-hero-icons" aria-hidden>
            {HERO_ICONS.map(([icon, tone], i) => (
              <span
                key={icon}
                className="pb-lg-float"
                style={{ "--i": i } as React.CSSProperties}
              >
                <GlassIcon icon={icon} tone={tone} size="xl" />
              </span>
            ))}
          </div>

          <h1 id="pb-lg-title" className="pb-lg-title">
            Same song.
            <br />
            Same second<span className="pb-lg-dot">.</span>
          </h1>
          <p className="pb-lg-sub">
            Listen to the same audio at the same moment, wherever you are.
            Share six characters, press play once.
          </p>

          <p className="pb-lg-chip">
            <span className="pb-lg-faint">projectblue.cc/room/</span>
            <strong>4ED678</strong>
          </p>

          <div className="pb-lg-cta">
            <a href="#request" className="pb-lg-pill pb-lg-pill--solid pb-lg-pill--lg">
              Request an invite
            </a>
            <Link href="/start" className="pb-lg-pill pb-lg-pill--lg">
              I have an invite
            </Link>
          </div>
        </section>

        <section id="how" className="pb-lg-section" aria-labelledby="pb-lg-how">
          <p className="pb-lg-eyebrow">How it works</p>
          <h2 id="pb-lg-how" className="pb-lg-h2">
            Three steps.
            <br />
            No sign&#8209;up.
          </h2>
          <ol className="pb-lg-grid pb-lg-grid--steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="pb-lg-card">
                <span className="pb-lg-card-num" aria-hidden>
                  0{i + 1}
                </span>
                <GlassIcon icon={s.icon} tone={s.tone} />
                <h3 className="pb-lg-card-title">{s.title}</h3>
                <p className="pb-lg-card-body">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="room" className="pb-lg-section" aria-labelledby="pb-lg-room">
          <p className="pb-lg-eyebrow">In a room</p>
          <h2 id="pb-lg-room" className="pb-lg-h2">
            Everything you need.
            <br />
            Nothing else.
          </h2>
          <ul className="pb-lg-grid pb-lg-grid--features">
            {FEATURES.map((f) => (
              <li key={f.title} className="pb-lg-card pb-lg-card--row">
                <GlassIcon icon={f.icon} tone={f.tone} size="sm" />
                <div>
                  <h3 className="pb-lg-card-title">{f.title}</h3>
                  <p className="pb-lg-card-body">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="request" className="pb-lg-section" aria-labelledby="pb-lg-request">
          <p className="pb-lg-eyebrow">Private beta</p>
          <h2 id="pb-lg-request" className="pb-lg-h2 pb-lg-h2--big">
            Get a room<span className="pb-lg-dot">.</span>
          </h2>
          <p className="pb-lg-sub">
            We&apos;re letting people in a few at a time. Leave your email and
            we&apos;ll send you an invite code when a spot opens.
          </p>
          <div className="pb-lg-card pb-lg-card--form">
            <div className="pb-lg-card-head">
              <GlassIcon icon="mail" tone="ink" size="sm" />
              <span>Request an invite</span>
            </div>
            <BetaRequestForm startExpanded />
          </div>
        </section>
      </main>

      <Footer note="v0.1 beta · projectblue.cc" showThemeToggle={false} />
    </div>
  );
};
