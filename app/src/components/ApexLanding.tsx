import Link from "next/link";
import { BetaRequestForm } from "./BetaRequestForm";
import { WordMark } from "./BrandMark";
import { Footer } from "./Footer";
import { GlassBar, GlassWindow } from "./GlassWindow";
import { LiquidHero } from "./LiquidHero";
import { SyncPanels } from "./SyncPanels";
import { ThemeToggle } from "./ThemeToggle";

const STEPS = [
  {
    title: "Open a room",
    body: (
      <>
        You get a code like <span className="pb-lg-code">4ED678</span>.
        That&apos;s the whole address.
      </>
    ),
  },
  {
    title: "Share six characters",
    body: (
      <>
        Text it, say it out loud, write it on a napkin. Anyone with the code
        joins straight from their browser. No account, nothing to install.
      </>
    ),
  },
  {
    title: "Press play once",
    body: (
      <>
        Drop in audio files or paste a YouTube link, or a whole playlist.
        Play, pause and skip land for everyone at the same moment.
      </>
    ),
  },
];

const ROOM_DETAILS: [string, string][] = [
  ["Plays", "Audio files you upload, YouTube videos and whole playlists"],
  ["Queue", "One shared queue, with shuffle and repeat"],
  ["Talk", "A chat that sits next to the music"],
  ["Control", "The host decides whether guests can add tracks"],
  ["Joining", "Six characters. No account needed"],
  ["Works on", "Phones and laptops, right in the browser"],
];

/**
 * The projectblue.cc front page during the private beta: explains the
 * product and collects access requests. Invited people start rooms at
 * /start; beta.projectblue.cc redirects here (see next.config.ts).
 * Liquid glass throughout, via @samasante/liquid-glass.
 */
export const ApexLanding = () => {
  return (
    <div className="pb-lg">
      <header className="pb-lg-header">
        <GlassBar className="pb-lg-nav">
          <div className="pb-lg-nav-inner">
            <WordMark asLink />
            <span className="pb-lg-beta">Beta</span>
            <nav className="pb-lg-links" aria-label="Sections">
              <a href="#how">How it works</a>
              <a href="#room">In a room</a>
              <a href="#request">Invite</a>
            </nav>
            <span className="pb-lg-spacer" aria-hidden />
            <Link href="/start" className="pb-lg-pill pb-lg-pill--hide-sm">
              Start a room
            </Link>
            <a href="#request" className="pb-lg-pill pb-lg-pill--solid">
              Request an invite
            </a>
            <ThemeToggle variant="icon" />
          </div>
        </GlassBar>
      </header>

      <main id="main">
        <section className="pb-lg-hero" aria-labelledby="pb-lg-title">
          <LiquidHero />
          <SyncPanels />
        </section>

        <section id="how" className="pb-lg-section" aria-labelledby="pb-lg-how">
          <p className="pb-lg-eyebrow">How it works</p>
          <h2 id="pb-lg-how" className="pb-lg-h2">
            Three steps.
            <br />
            No sign&#8209;up.
          </h2>
          <ol className="pb-lg-steps">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <GlassWindow title={`Step ${i + 1}`}>
                  <h3 className="pb-lg-step-title">{s.title}</h3>
                  <p className="pb-lg-step-body">{s.body}</p>
                </GlassWindow>
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
          <GlassWindow title="Room details" className="pb-lg-window--details">
            <dl className="pb-lg-details">
              {ROOM_DETAILS.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </GlassWindow>
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
          <GlassWindow title="Request an invite" className="pb-lg-window--form">
            <BetaRequestForm startExpanded />
          </GlassWindow>
        </section>
      </main>

      <Footer note="v0.1 beta · projectblue.cc" showThemeToggle={false} />
    </div>
  );
};
