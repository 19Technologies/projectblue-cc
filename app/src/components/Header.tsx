import Link from "next/link";
import type { ReactNode } from "react";
import { WordMark } from "./BrandMark";
import { GlassCapsule } from "./LiquidGlass";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  /** Section links, shown between the brand and the actions on wide screens. */
  children?: ReactNode;
  /** Where "Request an invite" points; the landing uses its own #request. */
  requestHref?: string;
  /** Hide the start/invite actions (e.g. the admin sign-in). */
  minimal?: boolean;
}

/** The floating glass nav capsule shared by every public page. */
export const Header = ({ children, requestHref = "/#request", minimal = false }: HeaderProps) => {
  return (
    <header className="pb-lg-header">
      <GlassCapsule className="pb-lg-capsule">
        <WordMark asLink />
        <span className="pb-lg-beta">Beta</span>
        {children}
        <span className="pb-lg-spacer" aria-hidden />
        {!minimal && (
          <>
            <Link href="/start" className="pb-lg-pill pb-lg-hide-sm">
              Start a room
            </Link>
            <a href={requestHref} className="pb-lg-pill pb-lg-pill--solid">
              <span className="pb-lg-long">Request an invite</span>
              <span className="pb-lg-short">Get an invite</span>
            </a>
          </>
        )}
        <ThemeToggle />
      </GlassCapsule>
    </header>
  );
};
