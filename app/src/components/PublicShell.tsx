import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { GlassIcon, type GlassIconName, type GlassTone } from "./LiquidGlass";

interface PublicShellProps {
  kicker?: string;
  title: ReactNode;
  icon?: GlassIconName;
  tone?: GlassTone;
  /** "narrow" for forms, "wide" (default) for reading. */
  width?: "narrow" | "wide";
  /** Hide the start/invite actions in the header. */
  minimalHeader?: boolean;
  children: ReactNode;
}

/**
 * Shared chrome for the public pages that aren't the landing: /signin,
 * /signup, /forgot-password, /terms, /privacy, /blog, /docs and single
 * posts/docs. A glass icon, a kicker and the title, then the content in
 * a frosted card.
 */
export const PublicShell = ({
  kicker,
  title,
  icon,
  tone = "ink",
  width = "wide",
  minimalHeader = false,
  children,
}: PublicShellProps) => {
  return (
    <div className="pb-welcome pb-shell">
      <Header minimal={minimalHeader} />

      <main id="main" className="pb-shell-main">
        <div className="pb-shell-head">
          {icon && <GlassIcon icon={icon} tone={tone} size="lg" />}
          {kicker && <p className="pb-lg-eyebrow">{kicker}</p>}
          <h1 className="pb-shell-title">{title}</h1>
        </div>
        <div className={`pb-lg-card pb-shell-card pb-shell-card--${width}`}>
          <div className="pb-legal-body">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
