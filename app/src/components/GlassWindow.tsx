"use client";

import { Glass, type GlassOptics } from "@samasante/liquid-glass";

/* A frosted glass sheet with a thin liquid rim. In Chrome/Edge it also bends
   the page behind it; Safari and Firefox get the frost, tint and edge light. */
export const WINDOW_OPTICS: Partial<GlassOptics> = {
  depth: 0.3,
  curvature: 0.15,
  strength: 0.05,
  dispersion: 0.35,
  bend: 0.6,
  bendWidth: 0.06,
  frost: 10,
  brightness: 0,
  specular: 1,
  sheen: 0.9,
  sheenWidth: 2,
  sheenAngle: 50,
  glow: 0.1,
};

const BAR_OPTICS: Partial<GlassOptics> = {
  ...WINDOW_OPTICS,
  frost: 14,
  bendWidth: 0.2,
  sheen: 0.6,
};

/* <Glass> puts display/position inline on its root, so layout (width,
   floating vs stacked) lives on a plain wrapper and the glass just fills it. */
const FILL: React.CSSProperties = { display: "block", height: "100%" };

/** A plain glass sheet (the sticky nav). */
export const GlassBar = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <Glass className={className} optics={BAR_OPTICS} style={FILL}>
    {children}
  </Glass>
);

interface GlassWindowProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

/** A macOS-style window: traffic lights, a title, and a glass body. */
export const GlassWindow = ({ title, className, children }: GlassWindowProps) => (
  <div className={`pb-lg-window-wrap${className ? ` ${className}` : ""}`}>
    <Glass
      className="pb-lg-window"
      optics={WINDOW_OPTICS}
      style={FILL}
      role="group"
      aria-label={title}
    >
      <div className="pb-lg-window-bar">
        <span className="pb-lg-lights" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="pb-lg-window-title">{title}</span>
      </div>
      <div className="pb-lg-window-body">{children}</div>
    </Glass>
  </div>
);
