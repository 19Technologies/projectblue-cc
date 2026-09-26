"use client";

import { Glass, glassValue, type GlassOptics } from "@samasante/liquid-glass";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/* A round lens over the hero. It bends the live page in place (covers,
   headline, even the dot grid), in Chrome, Safari and Firefox. */
const LENS_OPTICS: Partial<GlassOptics> = {
  strength: 0.14,
  depth: 0.95,
  curvature: 0.5,
  dispersion: 0.2,
  bend: 0.4,
  bendWidth: 0.07,
  sheen: 1.2,
  sheenWidth: 3.5,
  specular: 1.6,
  sheenAngle: 0,
  glow: 0.1,
  frost: 1,
  brightness: 0,
};

/** First-paint lens spot (fractions of the hero), before the last cover is
 *  measured; after that it rests on that cover's lower edge. */
const REST = { x: 0.635, y: 0.3 };

const COVERS = ["A1", "A2", "B1", "B2", "B3"];

const SMALL = "(max-width: 640px)";
const subscribeSmall = (cb: () => void) => {
  const mq = window.matchMedia(SMALL);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export const LiquidHero = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [cx] = useState(() => glassValue(REST.x));
  const [cy] = useState(() => glassValue(REST.y));
  const small = useSyncExternalStore(
    subscribeSmall,
    () => window.matchMedia(SMALL).matches,
    () => false
  );
  const lens = small ? 120 : 190;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rest = { ...REST };
    const measureRest = () => {
      const cover = stage.querySelector(".pb-lg-cover:last-child");
      if (!cover) return;
      const s = stage.getBoundingClientRect();
      const c = cover.getBoundingClientRect();
      rest.x = (c.left + c.width * 0.5 - s.left) / s.width;
      rest.y = (c.top + c.height * 0.95 - s.top) / s.height;
      if (reduce) {
        cx.set(rest.x);
        cy.set(rest.y);
      }
    };
    measureRest();
    const ro = new ResizeObserver(measureRest);
    ro.observe(stage);
    if (reduce) return () => ro.disconnect();

    const cur = { ...rest };
    let target = { ...rest };
    let lastMove = -Infinity;
    let raf = 0;

    // Follow the pointer across the hero; drift around the rest spot when idle.
    const onMove = (e: PointerEvent) => {
      const overWindow = (e.target as Element | null)?.closest?.(".pb-lg-window");
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      if (overWindow || x < 0 || x > 1 || y < 0 || y > 1) {
        lastMove = -Infinity;
        return;
      }
      target = { x, y };
      lastMove = performance.now();
    };

    const tick = (t: number) => {
      let tx = target.x;
      let ty = target.y;
      if (t - lastMove > 2500) {
        const s = t / 1000;
        tx = rest.x + Math.sin(s * 0.45) * 0.04;
        ty = rest.y + Math.cos(s * 0.33) * 0.04;
      }
      cur.x += (tx - cur.x) * 0.08;
      cur.y += (ty - cur.y) * 0.08;
      cx.set(cur.x);
      cy.set(cur.y);
      raf = requestAnimationFrame(tick);
    };

    // Only animate while the hero is on screen.
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(stage);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [cx, cy]);

  return (
    <Glass
      className="pb-lg-stage-glass"
      size={lens}
      radius={lens / 2}
      center={{ x: cx, y: cy }}
      optics={LENS_OPTICS}
      pixelUnits
    >
      <div ref={stageRef} className="pb-lg-stage">
        <div className="pb-lg-hero-inner">
          <div className="pb-lg-covers" aria-hidden>
            {COVERS.map((side, i) => (
              <div key={side} className={`pb-lg-cover pb-lg-cover--${i + 1}`}>
                <span>{side}</span>
              </div>
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
        </div>
      </div>
    </Glass>
  );
};
