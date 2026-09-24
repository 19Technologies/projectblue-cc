import { BetaRequestForm } from "./BetaRequestForm";
import { WordMark } from "./BrandMark";
import { Footer } from "./Footer";
import { SyncBoard } from "./SyncBoard";

const STEPS = [
  {
    title: "Open a room",
    body: (
      <>
        You get a code like <span className="pb-apex-code">4ED678</span>.
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
 * The projectblue.cc apex during the private beta. The real app lives on
 * beta.projectblue.cc; this page explains it and collects access requests.
 */
export const ApexLanding = () => {
  return (
    <div className="pb-welcome pb-apex">
      <header className="pb-welcome-header">
        <WordMark />
        <nav className="pb-welcome-nav" aria-label="Primary">
          <a href="#request" className="pb-nav-link pb-nav-link-primary">
            Request an invite
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="pb-apex-hero" aria-labelledby="pb-apex-title">
          <p className="pb-apex-eyebrow">
            <span className="pb-phase-tag">BETA</span>
            <span className="pb-apex-eyebrow-text">Listening rooms</span>
          </p>

          <h1 id="pb-apex-title" className="pb-apex-headline">
            Same song.
            <br />
            Same <span className="pb-emph">second.</span>
          </h1>

          <div className="pb-apex-hero-foot">
            <p className="pb-apex-aside">
              Below: four people, four time zones, one playhead.
            </p>
            <div>
              <p className="pb-apex-lead">
                Project Blue is a room where you and your people hear the same
                audio at the same moment, wherever you are. Share a
                six-character code, press play once, and everyone is in time.
              </p>
              <div className="pb-apex-cta">
                <a href="#request" className="pb-action-btn pb-apex-btn">
                  Request an invite
                </a>
                <a href="#how" className="pb-shuffle">
                  How it works
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-apex-band" aria-label="A room, live">
          <div className="pb-apex-band-inner">
            <SyncBoard />
          </div>
        </section>

        <section
          id="how"
          className="pb-apex-section pb-apex-reveal"
          aria-labelledby="pb-apex-how"
        >
          <p className="pb-apex-kicker">
            <span>01</span> How it works
          </p>
          <div>
            <h2 id="pb-apex-how" className="pb-apex-h2">
              Three steps. <span className="pb-emph">No sign-up.</span>
            </h2>
            <ol className="pb-apex-steps">
              {STEPS.map((s) => (
                <li key={s.title} className="pb-apex-step">
                  <h3 className="pb-apex-step-title">{s.title}</h3>
                  <p className="pb-apex-step-body">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="pb-apex-section pb-apex-reveal"
          aria-labelledby="pb-apex-room"
        >
          <p className="pb-apex-kicker">
            <span>02</span> In a room
          </p>
          <div>
            <h2 id="pb-apex-room" className="pb-apex-h2">
              Everything you need. <span className="pb-emph">Nothing else.</span>
            </h2>
            <dl className="pb-apex-summary">
              {ROOM_DETAILS.map(([k, v]) => (
                <div key={k} className="pb-apex-summary-row">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          id="request"
          className="pb-apex-request pb-apex-reveal"
          aria-labelledby="pb-apex-request-title"
        >
          <h2 id="pb-apex-request-title" className="pb-apex-request-title">
            Get a <span className="pb-emph">room.</span>
          </h2>
          <div className="pb-apex-request-body">
            <p className="pb-apex-lead">
              We&apos;re letting people in a few at a time. Leave your email and
              we&apos;ll send you an invite code when a spot opens.
            </p>
            <BetaRequestForm startExpanded />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
