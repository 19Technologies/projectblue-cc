"use client";

import { Glass, type GlassOptics } from "@samasante/liquid-glass";
import {
  Crown,
  DoorOpen,
  Hash,
  Headphones,
  Link2,
  ListMusic,
  Mail,
  MessageCircle,
  MonitorSmartphone,
  Music2,
  Play,
  Send,
  Users,
} from "lucide-react";

// Icons are picked by name: server components can't pass components to a
// client one.
const ICONS = {
  crown: Crown,
  devices: MonitorSmartphone,
  door: DoorOpen,
  hash: Hash,
  headphones: Headphones,
  link: Link2,
  list: ListMusic,
  mail: Mail,
  message: MessageCircle,
  music: Music2,
  play: Play,
  send: Send,
  users: Users,
} as const;

export type GlassIconName = keyof typeof ICONS;
export type GlassTone = "sunset" | "tide" | "grove" | "ember" | "bloom" | "ink";

/** Solid edge colour per tone, for the thin bleed ring past the refracted fill. */
const EDGE: Record<GlassTone, string> = {
  sunset: "#FF6B5E",
  tide: "#1E7BFF",
  grove: "#2FB457",
  ember: "#FF8A1F",
  bloom: "#F0328F",
  ink: "#5577E0",
};

/* A thick glass bead: the rim bends the colour behind it, a bright sheen
   pools top-left, and a soft glow lifts the middle. */
const ICON_OPTICS: Partial<GlassOptics> = {
  clipToShape: true,
  softEdge: true,
  depth: 0.55,
  curvature: 0.4,
  strength: 0.16,
  dispersion: 0.5,
  bend: 0.85,
  bendWidth: 0.16,
  frost: 0,
  brightness: 0.05,
  specular: 1.5,
  sheen: 1.4,
  sheenWidth: 2.5,
  sheenAngle: 45,
  glow: 0.35,
  glowSpread: 0.5,
  glowFalloff: 1.5,
};

interface GlassIconProps {
  icon: GlassIconName;
  tone: GlassTone;
  size?: "xl" | "md" | "sm";
}

/** An Apple-style liquid glass app icon: a colour field refracted through a
 *  glass tile, with the glyph crisp on top. Sized by CSS, so it scales.
 *  The glyph is a sibling of <Glass>, not a child: its refraction layer
 *  paints over its own children. */
export const GlassIcon = ({ icon, tone, size = "md" }: GlassIconProps) => {
  const Icon = ICONS[icon];
  return (
    <span className={`pb-gi pb-gi--${size} pb-tone-${tone}`} aria-hidden>
      <Glass
        className="pb-gi-glass"
        style={{ display: "block" }}
        optics={ICON_OPTICS}
        refract={<span className="pb-gi-fill" />}
        behind={EDGE[tone]}
      />
      <span className="pb-gi-face">
        <Icon className="pb-gi-glyph" strokeWidth={2.2} aria-hidden />
      </span>
    </span>
  );
};

const CAPSULE_OPTICS: Partial<GlassOptics> = {
  depth: 0.3,
  curvature: 0.15,
  strength: 0.05,
  dispersion: 0.35,
  bend: 0.6,
  bendWidth: 0.3,
  frost: 16,
  specular: 1,
  sheen: 0.8,
  sheenWidth: 2,
  sheenAngle: 50,
  glow: 0.1,
};

/** The floating glass nav capsule. */
export const GlassCapsule = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <Glass className={className} optics={CAPSULE_OPTICS} style={{ display: "flex" }}>
    {children}
  </Glass>
);
